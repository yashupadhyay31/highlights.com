import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CONTINENT_LABELS } from '../data/mockEvents';
import { LAND_RINGS } from '../data/landRings';
import {
  COUNTRY_BORDERS,
  STATE_BORDERS,
  COUNTRY_LABELS_LOD,
  STATE_LABELS_LOD
} from '../data/bordersData';
import {
  Plus,
  Minus,
  Crosshair,
  ShieldCheck,
  Pause,
  Play,
  Layers
} from 'lucide-react';

export default function Globe3D() {
  const mountRef = useRef(null);
  const {
    filteredEvents,
    handleSelectEvent,
    setHoveredEvent,
    autoRotate,
    setAutoRotate,
    globeFlyTo,
    globeSubMode,
    handleSetSubMode,
    zoomCommand,
    handleZoomIn,
    handleZoomOut,
    handleRecenter
  } = useApp();

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeGroupRef = useRef(null);
  const markersGroupRef = useRef(null);
  const continentLabelsGroupRef = useRef(null);
  const countryLabelsGroupRef = useRef(null);
  const stateLabelsGroupRef = useRef(null);
  const countryBordersMeshRef = useRef(null);
  const stateBordersMeshRef = useRef(null);
  const countryBordersMatRef = useRef(null);
  const stateBordersMatRef = useRef(null);
  const globeMeshRef = useRef(null);
  const pulseRingsRef = useRef([]);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.35, y: -0.6 });
  const currentRotationRef = useRef({ x: 0.35, y: -0.6 });
  const targetDistanceRef = useRef(240);
  const currentDistanceRef = useRef(240);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mousePosRef = useRef(new THREE.Vector2());
  const autoRotateRef = useRef(autoRotate);

  // Tactical LOD Zoom Level Status (Global, National, State)
  const [zoomLodStatus, setZoomLodStatus] = useState('GLOBAL VIEW');

  // Cached Three.js textures
  const texturesCacheRef = useRef({ cyber: null, satellite: null });

  // Keep autoRotateRef in sync with React state
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Category Color Map
  const categoryColorMap = useRef(
    CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = new THREE.Color(cat.color);
      return acc;
    }, {})
  );

  // Convert Lat/Lng to Vector3 on Globe Surface
  const latLngToVector3 = (lat, lng, radius = 100) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Helper: Build Curved Spherical LineSegments Geometry from 2D Lat/Lng Paths
  const buildCurvedLineSegments = (paths, radius = 100.2) => {
    const positions = [];

    paths.forEach((path) => {
      if (!path || path.length < 2) return;
      for (let i = 0; i < path.length - 1; i++) {
        const [lng1, lat1] = path[i];
        const [lng2, lat2] = path[i + 1];

        // Skip wrap-around segment jumps
        if (Math.abs(lng2 - lng1) > 180) continue;

        const v1 = latLngToVector3(lat1, lng1, radius);
        const v2 = latLngToVector3(lat2, lng2, radius);
        const dist = v1.distanceTo(v2);

        // Subdivide longer lines along great circle arc
        const steps = Math.max(1, Math.min(8, Math.ceil(dist / 4)));
        let prevVec = v1;

        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const nextVec = new THREE.Vector3().copy(v1).lerp(v2, t).normalize().multiplyScalar(radius);
          positions.push(prevVec.x, prevVec.y, prevVec.z);
          positions.push(nextVec.x, nextVec.y, nextVec.z);
          prevVec = nextVec;
        }
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  };

  // Helper: Draw all Landmass Rings onto Canvas context
  const drawLandmassRings = (ctx, canvasWidth, canvasHeight, fillStyle, strokeStyle, lineWidth = 1.5, glowColor = null) => {
    ctx.save();
    if (glowColor) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
    }
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    LAND_RINGS.forEach((ring) => {
      if (!ring || ring.length < 2) return;
      ctx.beginPath();
      let prevLng = null;
      ring.forEach(([lng, lat], i) => {
        const x = ((lng + 180) / 360) * canvasWidth;
        const y = ((90 - lat) / 180) * canvasHeight;
        if (i === 0 || (prevLng !== null && Math.abs(lng - prevLng) > 180)) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        prevLng = lng;
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();
  };

  // Generate High-Tech Procedural Earth Texture (Cyber Geoid Mode)
  const getCyberTexture = () => {
    if (texturesCacheRef.current.cyber) {
      return texturesCacheRef.current.cyber;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // 1. Deep Obsidian / Space Ocean Background
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#020612');
    oceanGrad.addColorStop(0.5, '#040E24');
    oceanGrad.addColorStop(1, '#020612');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle Ocean Bathymetry Waves
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.025)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 3. Graticule Lines (Latitude / Longitude with Precision Dash)
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
    ctx.setLineDash([4, 6]);
    ctx.lineWidth = 1;

    for (let lat = -80; lat <= 80; lat += 15) {
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    for (let lng = -180; lng <= 180; lng += 15) {
      const x = ((lng + 180) / 360) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 4. Equator and Prime Meridian Highlights
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.22)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // 5. Draw All Real World Landmass Polygons from landRings.js
    const landFill = '#07152B';
    const landStroke = '#00F2FE';
    drawLandmassRings(ctx, canvas.width, canvas.height, landFill, landStroke, 2.2, '#00F2FE');

    // 6. Draw Strategic Global Cyber Nodes
    const strategicNodes = [
      [-74.0, 40.7], [-122.4, 37.8], [-0.1, 51.5], [2.3, 48.9],
      [13.4, 52.5], [37.6, 55.7], [55.3, 25.2], [77.2, 28.6],
      [116.4, 39.9], [121.5, 31.2], [139.7, 35.7], [103.8, 1.3],
      [151.2, -33.9], [-43.2, -22.9], [31.2, 30.0], [18.4, -33.9]
    ];

    ctx.fillStyle = '#00F2FE';
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 10;
    strategicNodes.forEach(([lng, lat]) => {
      const x = ((lng + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.stroke();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texturesCacheRef.current.cyber = texture;
    return texture;
  };

  // Generate Satellite Reconnaissance Texture Mode
  const getSatelliteTexture = () => {
    if (texturesCacheRef.current.satellite) {
      return texturesCacheRef.current.satellite;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#010613';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
    ctx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 20) {
      const x = ((lng + 180) / 360) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    const satLandFill = '#0C1C33';
    const satLandStroke = '#1E3A8A';
    drawLandmassRings(ctx, canvas.width, canvas.height, satLandFill, satLandStroke, 1.8, '#1D4ED8');

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texturesCacheRef.current.satellite = texture;
    return texture;
  };

  // Create Continent Typography Sprite
  const createContinentSprite = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.font = '800 30px "Inter", sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '4px';
    ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
    ctx.shadowBlur = 12;
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.82
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(38, 9.5, 1);
    return sprite;
  };

  // Create Country / Nation Label Sprite (LOD 2)
  const createCountrySprite = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    // Translucent tactical pill box
    ctx.fillStyle = 'rgba(6, 11, 24, 0.75)';
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(16, 16, 352, 64, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 24px "Inter", sans-serif';
    ctx.fillStyle = '#00F2FE';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '2px';
    ctx.shadowColor = 'rgba(0, 242, 254, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(text, 192, 48);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.0
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(22, 5.5, 1);
    return sprite;
  };

  // Create State / Provincial Regional Label Sprite (LOD 3)
  const createStateSprite = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.font = '700 18px "Inter", sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
    ctx.shadowBlur = 6;
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.0
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(15, 3.8, 1);
    return sprite;
  };

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.z = currentDistanceRef.current;
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.8);
    dirLight1.position.set(200, 150, 300);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 1.4);
    dirLight2.position.set(-200, -150, -200);
    scene.add(dirLight2);

    // 5. Starfield Dust Particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 1200;
      starPositions[i + 1] = (Math.random() - 0.5) * 1200;
      starPositions[i + 2] = -200 - Math.random() * 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 1.8,
      transparent: true,
      opacity: 0.6
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Primary Globe Sphere
    const globeGeo = new THREE.SphereGeometry(100, 64, 64);
    const globeTexture = globeSubMode === 'satellite' ? getSatelliteTexture() : getCyberTexture();
    const globeMat = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughness: 0.85,
      metalness: 0.2
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);
    globeMeshRef.current = globeMesh;

    // Atmosphere Glow Halo (Smooth Cyber Azure Fresnel)
    const atmosGeo = new THREE.SphereGeometry(104.5, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.0, 0.95, 1.0, 1.0) * intensity * 0.9;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // Cyber Atmosphere Equatorial Ring
    const ringGeo = new THREE.RingGeometry(112, 114, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.rotation.x = Math.PI / 2.3;
    globeGroup.add(orbitalRing);

    // 7. Dynamic Vector Borders (Country & State LOD)
    // Country Borders (Spherical Vector 3D LineSegments)
    const countryBordersGeo = buildCurvedLineSegments(COUNTRY_BORDERS, 100.25);
    const countryBordersMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.0,
      linewidth: 1.5,
      depthWrite: false
    });
    const countryBordersMesh = new THREE.LineSegments(countryBordersGeo, countryBordersMat);
    globeGroup.add(countryBordersMesh);
    countryBordersMeshRef.current = countryBordersMesh;
    countryBordersMatRef.current = countryBordersMat;

    // State / Province Borders (Spherical Vector 3D LineSegments)
    const stateBordersGeo = buildCurvedLineSegments(STATE_BORDERS, 100.28);
    const stateBordersMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
      linewidth: 1.2,
      depthWrite: false
    });
    const stateBordersMesh = new THREE.LineSegments(stateBordersGeo, stateBordersMat);
    globeGroup.add(stateBordersMesh);
    stateBordersMeshRef.current = stateBordersMesh;
    stateBordersMatRef.current = stateBordersMat;

    // 8. Dynamic Labels Groups (Continent, Country, State)
    // Continent Labels Group
    const continentLabelsGroup = new THREE.Group();
    globeGroup.add(continentLabelsGroup);
    continentLabelsGroupRef.current = continentLabelsGroup;
    CONTINENT_LABELS.forEach(lbl => {
      const sprite = createContinentSprite(lbl.name);
      const pos = latLngToVector3(lbl.lat, lbl.lng, 102.5);
      sprite.position.copy(pos);
      continentLabelsGroup.add(sprite);
    });

    // Country Labels Group (LOD 2)
    const countryLabelsGroup = new THREE.Group();
    globeGroup.add(countryLabelsGroup);
    countryLabelsGroupRef.current = countryLabelsGroup;
    COUNTRY_LABELS_LOD.forEach(lbl => {
      const sprite = createCountrySprite(lbl.name);
      const pos = latLngToVector3(lbl.lat, lbl.lng, 101.8);
      sprite.position.copy(pos);
      countryLabelsGroup.add(sprite);
    });

    // State / Province Labels Group (LOD 3)
    const stateLabelsGroup = new THREE.Group();
    globeGroup.add(stateLabelsGroup);
    stateLabelsGroupRef.current = stateLabelsGroup;
    STATE_LABELS_LOD.forEach(lbl => {
      const sprite = createStateSprite(lbl.name);
      const pos = latLngToVector3(lbl.lat, lbl.lng, 101.4);
      sprite.position.copy(pos);
      stateLabelsGroup.add(sprite);
    });

    // 9. Markers Group
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // Mouse Dragging & Hover Controls
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mousePosRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePosRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.005;
        targetRotationRef.current.x += deltaY * 0.005;
        targetRotationRef.current.x = Math.max(-1.2, Math.min(1.2, targetRotationRef.current.x));

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }

      // Check Marker Hover via Raycaster
      if (cameraRef.current && markersGroupRef.current) {
        raycasterRef.current.setFromCamera(mousePosRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(markersGroupRef.current.children, true);

        if (intersects.length > 0) {
          container.style.cursor = 'pointer';
          let foundObj = intersects[0].object;
          while (foundObj && !foundObj.userData?.event && foundObj.parent) {
            foundObj = foundObj.parent;
          }
          if (foundObj?.userData?.event) {
            setHoveredEvent({
              event: foundObj.userData.event,
              screenX: e.clientX,
              screenY: e.clientY
            });
          }
        } else {
          container.style.cursor = 'grab';
          setHoveredEvent(null);
        }
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onClick = (e) => {
      if (!cameraRef.current || !markersGroupRef.current) return;
      raycasterRef.current.setFromCamera(mousePosRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(markersGroupRef.current.children, true);
      if (intersects.length > 0) {
        let foundObj = intersects[0].object;
        while (foundObj && !foundObj.userData?.event && foundObj.parent) {
          foundObj = foundObj.parent;
        }
        if (foundObj?.userData?.event) {
          handleSelectEvent(foundObj.userData.event);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      targetDistanceRef.current += e.deltaY * 0.15;
      targetDistanceRef.current = Math.max(140, Math.min(420, targetDistanceRef.current));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();
    let lastLodCheck = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto-rotation when not dragging and not paused
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0014;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = currentRotationRef.current.x;
        globeGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Camera distance interpolation
      currentDistanceRef.current += (targetDistanceRef.current - currentDistanceRef.current) * 0.1;
      const dist = currentDistanceRef.current;
      camera.position.z = dist;

      // ----------------------------------------------------
      // DYNAMIC ZOOM-DEPENDENT LEVEL-OF-DETAIL (LOD) OPACITY
      // ----------------------------------------------------
      // 1. Country Borders: always visible, brighten as zoom increases
      const countryFactor = Math.max(0.55, Math.min(1, (420 - dist) / (420 - 165)));
      const countryOpacity = countryFactor * 0.9;

      if (countryBordersMatRef.current) {
        countryBordersMatRef.current.opacity = countryOpacity;
        countryBordersMatRef.current.visible = true;
      }

      if (countryLabelsGroupRef.current) {
        countryLabelsGroupRef.current.children.forEach(sprite => {
          sprite.material.opacity = countryFactor * 0.95;
          sprite.visible = countryFactor > 0.05;
        });
      }

      // 2. State / Provincial Borders: smoothly fade in when zooming in further (between 175 and 140)
      const stateFactor = Math.max(0, Math.min(1, (175 - dist) / (175 - 145)));
      const stateOpacity = stateFactor * 0.72;

      if (stateBordersMatRef.current) {
        stateBordersMatRef.current.opacity = stateOpacity;
        stateBordersMatRef.current.visible = stateOpacity > 0.01;
      }

      if (stateLabelsGroupRef.current) {
        stateLabelsGroupRef.current.children.forEach(sprite => {
          sprite.material.opacity = stateFactor * 0.9;
          sprite.visible = stateFactor > 0.05;
        });
      }

      // 3. Continent Labels: fade out when zoomed in so they don't occlude regional borders
      const continentFactor = Math.max(0, Math.min(1, (dist - 170) / (230 - 170)));
      if (continentLabelsGroupRef.current) {
        continentLabelsGroupRef.current.children.forEach(sprite => {
          sprite.material.opacity = continentFactor * 0.82;
          sprite.visible = continentFactor > 0.05;
        });
      }

      // Periodic LOD HUD Status update (throttled to every 250ms)
      if (elapsedTime - lastLodCheck > 0.25) {
        lastLodCheck = elapsedTime;
        if (dist <= 170) {
          setZoomLodStatus('LOD 3 • STATE / PROVINCIAL REGIONS');
        } else if (dist <= 210) {
          setZoomLodStatus('LOD 2 • NATIONAL COUNTRY BORDERS');
        } else {
          setZoomLodStatus('LOD 1 • GLOBAL STRATEGIC VIEW');
        }
      }

      // Pulse Radar Rings Animation
      pulseRingsRef.current.forEach((ring) => {
        if (ring) {
          const s = 1 + (Math.sin(elapsedTime * 3 + ring.userData.offset) + 1) * 0.55;
          ring.scale.set(s, s, s);
          ring.material.opacity = Math.max(0, 0.85 - (s - 1) * 0.85);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement) {
        renderer.domElement.remove();
      }
      renderer.dispose();
    };
  }, []);

  // Update Globe Texture if submode toggles (Satellite vs 3D)
  useEffect(() => {
    if (!globeMeshRef.current) return;
    globeMeshRef.current.material.map = globeSubMode === 'satellite' ? getSatelliteTexture() : getCyberTexture();
    globeMeshRef.current.material.needsUpdate = true;
  }, [globeSubMode]);

  // Handle Zoom & Recenter Commands from HUD controls
  useEffect(() => {
    if (!zoomCommand) return;
    if (zoomCommand.type === 'in') {
      targetDistanceRef.current = Math.max(140, targetDistanceRef.current - 40);
    } else if (zoomCommand.type === 'out') {
      targetDistanceRef.current = Math.min(420, targetDistanceRef.current + 40);
    } else if (zoomCommand.type === 'reset') {
      targetDistanceRef.current = 240;
      targetRotationRef.current = { x: 0.35, y: -0.6 };
    }
  }, [zoomCommand]);

  // Update Event Markers when filteredEvents changes
  useEffect(() => {
    if (!markersGroupRef.current) return;

    while (markersGroupRef.current.children.length > 0) {
      const obj = markersGroupRef.current.children[0];
      markersGroupRef.current.remove(obj);
    }
    pulseRingsRef.current = [];

    filteredEvents.forEach((ev, idx) => {
      const markerGroup = new THREE.Group();
      markerGroup.userData = { event: ev };

      const pos = latLngToVector3(ev.location.lat, ev.location.lng, 100);
      markerGroup.position.copy(pos);
      markerGroup.lookAt(pos.clone().multiplyScalar(2));

      const color = categoryColorMap.current[ev.category] || new THREE.Color(0x00f2fe);

      // Core Marker Sphere
      const beaconGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: color });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.z = 1.2;
      beaconMesh.userData = { event: ev };
      markerGroup.add(beaconMesh);

      // Pin Stem
      const stemGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 8);
      stemGeo.rotateX(Math.PI / 2);
      const stemMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.65 });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.z = 2;
      markerGroup.add(stemMesh);

      // Concentric Radar Pulse Ring
      const ringGeo = new THREE.RingGeometry(2.2, 3.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.userData = { offset: idx * 0.8 };
      markerGroup.add(ringMesh);
      pulseRingsRef.current.push(ringMesh);

      // Red Halo for Hot Alerts
      if (ev.isHotAlert) {
        const outerGlowGeo = new THREE.RingGeometry(4.2, 5.4, 32);
        const outerGlowMat = new THREE.MeshBasicMaterial({
          color: 0xef4444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat);
        outerGlow.userData = { offset: idx * 0.8 + 1 };
        markerGroup.add(outerGlow);
        pulseRingsRef.current.push(outerGlow);
      }

      markersGroupRef.current.add(markerGroup);
    });
  }, [filteredEvents]);

  // Fly Camera to Coordinates when globeFlyTo changes
  useEffect(() => {
    if (!globeFlyTo) return;
    const phi = (globeFlyTo.lat * Math.PI) / 180;
    const theta = ((globeFlyTo.lng + 90) * Math.PI) / 180;
    targetRotationRef.current = { x: phi, y: -theta };
    targetDistanceRef.current = 160; // Zoom in to country level
  }, [globeFlyTo]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* TOP-LEFT VIEW MODE PILLS: [ 3D | 2D | Satellite ] */}
      <div
        style={{
          position: 'absolute',
          top: '118px',
          left: '356px',
          zIndex: 25,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(10, 15, 31, 0.85)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-full)',
          padding: '3px 4px',
          gap: '2px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <button
          onClick={() => handleSetSubMode('3d')}
          style={{
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            background: globeSubMode === '3d' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
            border: '1px solid',
            borderColor: globeSubMode === '3d' ? 'var(--accent-cyan)' : 'transparent',
            color: globeSubMode === '3d' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontSize: '0.76rem',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          3D
        </button>

        <button
          onClick={() => handleSetSubMode('2d')}
          style={{
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            background: globeSubMode === '2d' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
            border: '1px solid',
            borderColor: globeSubMode === '2d' ? 'var(--accent-cyan)' : 'transparent',
            color: globeSubMode === '2d' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontSize: '0.76rem',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          2D
        </button>

        <button
          onClick={() => handleSetSubMode('satellite')}
          style={{
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            background: globeSubMode === 'satellite' ? 'rgba(0, 242, 254, 0.18)' : 'transparent',
            border: '1px solid',
            borderColor: globeSubMode === 'satellite' ? 'var(--accent-cyan)' : 'transparent',
            color: globeSubMode === 'satellite' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontSize: '0.76rem',
            fontWeight: '700',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Satellite
        </button>
      </div>



      {/* TOP-RIGHT MAP CONTROLS: [ + | - | ⌖ | ⏸ / ▶ ] */}
      <div
        style={{
          position: 'absolute',
          top: '118px',
          right: '356px',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(10, 15, 31, 0.85)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          gap: '3px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <button
          onClick={handleZoomIn}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Zoom In (Reveals Country & State Borders)"
        >
          <Plus size={16} />
        </button>

        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1px 2px' }} />

        <button
          onClick={handleZoomOut}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>

        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1px 2px' }} />

        <button
          onClick={handleRecenter}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-cyan)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'background 0.15s'
          }}
          title="Recenter Globe"
        >
          <Crosshair size={16} />
        </button>

        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1px 2px' }} />

        {/* Rotation Pause / Resume Toggle Button */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            background: autoRotate ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
            border: 'none',
            color: autoRotate ? 'var(--accent-cyan)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'all 0.15s'
          }}
          title={autoRotate ? 'Pause Earth Rotation' : 'Resume Earth Rotation'}
        >
          {autoRotate ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </div>

      {/* BOTTOM-LEFT GLOBE LEGEND BOX */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '356px',
          zIndex: 25,
          background: 'rgba(10, 15, 31, 0.88)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: '#F1F5F9' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', boxShadow: '0 0 6px #EF4444' }} />
          <span>Conflict/Zone</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: '#F1F5F9' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F97316', boxShadow: '0 0 6px #F97316' }} />
          <span>High Tension</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: '#F1F5F9' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EAB308', boxShadow: '0 0 6px #EAB308' }} />
          <span>Political Unrest</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: '#F1F5F9' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6', boxShadow: '0 0 6px #3B82F6' }} />
          <span>Economic Impact</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: '#F1F5F9' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
          <span>Environmental</span>
        </div>
      </div>

      {/* BOTTOM-RIGHT BADGE: Verified Sources • 12+ Trusted Sources */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          right: '356px',
          zIndex: 25,
          background: 'rgba(10, 15, 31, 0.88)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(0, 242, 254, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}
        >
          <ShieldCheck size={14} />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.2' }}>
            Verified sources
          </div>
          <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            12+ trusted sources
          </div>
        </div>
      </div>
    </div>
  );
}
