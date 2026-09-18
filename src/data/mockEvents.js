export const CATEGORIES = [
  {
    id: 'corruption',
    name: 'Corruption & Fraud',
    icon: 'Landmark',
    sign: '💰',
    signName: 'Financial Fraud & Bribery',
    signType: 'money',
    color: '#F59E0B', // Amber / Gold
    glow: 'rgba(245, 158, 11, 0.4)',
    description: 'Procurement bribery, embezzlement, offshore shell laundering, financial fraud'
  },
  {
    id: 'conflict',
    name: 'War & Conflict',
    icon: 'Swords',
    sign: '⚔️',
    signName: 'Military Conflict & Airstrikes',
    signType: 'swords',
    color: '#EF4444', // Red / Crimson
    glow: 'rgba(239, 68, 68, 0.5)',
    description: 'Military clashes, territorial disputes, insurgencies, airstrikes'
  },
  {
    id: 'calamity',
    name: 'Natural Calamities',
    icon: 'Waves',
    sign: '🌊',
    signName: 'Natural Disasters & Calamities',
    signType: 'wave',
    color: '#06B6D4', // Cyan
    glow: 'rgba(6, 182, 212, 0.4)',
    description: 'Floods, earthquakes, hurricanes, volcanic activity, tsunamis'
  },
  {
    id: 'crime',
    name: 'Criminal Offenses',
    icon: 'ShieldAlert',
    sign: '🚨',
    signName: 'Cartel & Security Threat',
    signType: 'siren',
    color: '#EC4899', // Pink
    glow: 'rgba(236, 72, 153, 0.4)',
    description: 'Organized crime, cyber heists, smuggling, high-risk security threats'
  },
  {
    id: 'politics',
    name: 'Political & Protests',
    icon: 'Vote',
    sign: '📢',
    signName: 'Civil Protests & Unrest',
    signType: 'megaphone',
    color: '#8B5CF6', // Purple
    glow: 'rgba(139, 92, 246, 0.4)',
    description: 'Mass civil unrest, constitutional crises, disputed elections'
  },
  {
    id: 'environmental',
    name: 'Water & Ecological',
    icon: 'Droplets',
    sign: '🌿',
    signName: 'Ecological & Resource Crisis',
    signType: 'leaf',
    color: '#10B981', // Emerald
    glow: 'rgba(16, 185, 129, 0.4)',
    description: 'Aquifer depletion, industrial spills, severe drought, forest fires'
  },
  {
    id: 'technology',
    name: 'Critical Infrastructure',
    icon: 'Cpu',
    sign: '⚡',
    signName: 'Cyberattacks & Grid Failures',
    signType: 'lightning',
    color: '#3B82F6', // Blue
    glow: 'rgba(59, 130, 246, 0.4)',
    description: 'Power grid collapses, undersea fiber cuts, satellite outages'
  },
  {
    id: 'health',
    name: 'Disease Outbreaks',
    icon: 'Biohazard',
    sign: '☣️',
    signName: 'Epidemics & Biohazards',
    signType: 'biohazard',
    color: '#F97316', // Orange
    glow: 'rgba(249, 115, 22, 0.4)',
    description: 'Pathogen clusters, epidemic alerts, biohazard containment'
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'ev-gaza-ops',
    title: 'Israel expands ground operations in southern Gaza',
    category: 'conflict',
    subcategory: 'CONFLICT',
    severity: 'critical',
    status: 'active',
    verificationStatus: 'VERIFIED',
    source: 'Reuters',
    flag: '🇮🇱',
    location: {
      city: 'Rafah',
      state: 'Southern Gaza',
      country: 'Gaza Strip',
      lat: 31.2968,
      lng: 34.2455,
      region: 'middle-east'
    },
    timestamp: '2h ago',
    date: '2026-09-17',
    time: '04:15 UTC',
    isHotAlert: true,
    summary: 'IDF forces push deeper into Rafah as ceasefire talks remain stalled, according to multiple sources.',
    fullDescription: 'Renewed airstrikes and troop movements reported across southern territories. Ground brigades have advanced into western urban sectors of Rafah following heavy artillery preparation. Regional ceasefire talks hosted in Cairo and Doha remain deadlocked over border corridor control points.',
    escalationRisk: {
      level: 'High',
      intensity: 'High Intensity',
      momentum: '+72%',
      strength: 'Strong',
      description: 'Renewed airstrikes and troop movements reported across southern territories.'
    },
    timeline: [
      { time: '02:00', label: 'Artillery Barrage', desc: 'Sustained artillery shelling reported along the Philadelphi corridor.', verified: true },
      { time: '03:40', label: 'Armored Advance', desc: 'Armored columns penetrate western residential perimeters of Rafah.', verified: true },
      { time: '04:15', label: 'Reuters Field Dispatch', desc: 'Humanitarian agency corridors suspended due to proximity of kinetic strikes.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-K29P4',
      level: 'Veteran',
      trustScore: 185,
      approvedReports: 34,
      falseReports: 0,
      privateKyc: {
        realName: 'Tariq Al-Masri',
        email: 't.masri.field@intelligence-mesh.org',
        phone: '+970 59 924 1102',
        identityVerified: true,
        deviceFingerprint: 'DEV-RFH-8821'
      }
    },
    communityTrust: {
      trustVotes: 1420,
      disputeVotes: 84,
      trustPercentage: 94
    },
    evidence: [
      {
        type: 'image',
        title: 'Thermal Satellite Reconnaissance - Southern Sector',
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        caption: 'Thermal satellite overlay confirming armored vehicle staging.'
      },
      {
        type: 'image',
        title: 'Perimeter Smoke Plumes & Tactical Movements',
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        caption: 'Visual confirmation of kinetic operations in western sector.'
      }
    ],
    tags: ['#Gaza', '#Rafah', '#GroundOperations', '#Reuters', '#Military']
  },
  {
    id: 'ev-taiwan-strait',
    title: 'China increases military activity near Taiwan',
    category: 'conflict',
    subcategory: 'SECURITY',
    severity: 'high',
    status: 'active',
    verificationStatus: 'VERIFIED',
    source: 'AP News',
    flag: '🇹🇼',
    location: {
      city: 'Taipei',
      state: 'Taiwan Strait',
      country: 'Taiwan',
      lat: 23.6978,
      lng: 120.9605,
      region: 'asia-pacific'
    },
    timestamp: '4h ago',
    date: '2026-09-17',
    time: '02:30 UTC',
    isHotAlert: true,
    summary: 'Multiple aircraft and naval vessels detected in the region over the past 24 hours.',
    fullDescription: 'Taiwan Ministry of National Defense detected 38 PLA aircraft and 9 PLAN warships operating within the air defense identification zone (ADIZ) across the median line of the Taiwan Strait.',
    escalationRisk: {
      level: 'Elevated',
      intensity: 'Medium-High',
      momentum: '+54%',
      strength: 'Moderate',
      description: 'Coordinated amphibious readiness drills reported along eastern coastal test ranges.'
    },
    timeline: [
      { time: '23:00', label: 'ADIZ Incursion', desc: 'J-16 and Su-30 sorties cross south-western ADIZ boundary.', verified: true },
      { time: '01:15', label: 'Naval Flotilla Formation', desc: 'Type 052D destroyer leads group transiting Miyako Strait.', verified: true },
      { time: '02:30', label: 'Combat Air Patrol Alert', desc: 'Taiwan Air Force scrambles F-16V interceptors for visual shadowing.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-T99X2',
      level: 'Virtuoso',
      trustScore: 194,
      approvedReports: 51,
      falseReports: 0,
      privateKyc: {
        realName: 'Wei-Lin Chen',
        email: 'chen.weilin.tpe@proton.me',
        phone: '+886 912 345 678',
        identityVerified: true,
        deviceFingerprint: 'DEV-TPE-4109'
      }
    },
    communityTrust: {
      trustVotes: 980,
      disputeVotes: 42,
      trustPercentage: 96
    },
    evidence: [
      {
        type: 'image',
        title: 'Radar Telemetry Plot - Taiwan Strait Median Line',
        url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
        caption: 'Civilian and military radar tracks showing combined sortie paths.'
      }
    ],
    tags: ['#Taiwan', '#PLA', '#APNews', '#AviationAlert', '#MaritimeSecurity']
  },
  {
    id: 'ev-eu-indopacific',
    title: 'EU reaches new trade framework with Indo-Pacific nations',
    category: 'politics',
    subcategory: 'POLITICS',
    severity: 'moderate',
    status: 'active',
    verificationStatus: 'VERIFIED',
    source: 'Financial Times',
    flag: '🇪🇺',
    location: {
      city: 'Brussels',
      state: 'Brussels Capital Region',
      country: 'Belgium',
      lat: 50.8503,
      lng: 4.3517,
      region: 'europe'
    },
    timestamp: '5h ago',
    date: '2026-09-17',
    time: '01:00 UTC',
    isHotAlert: true,
    summary: 'Agreement aims to strengthen supply chains and reduce economic dependencies.',
    fullDescription: 'European Commission delegates and trade representatives from seven Indo-Pacific countries have formalized a multilateral commerce and technology supply pact, specifically addressing critical minerals, semiconductors, and green shipping corridors.',
    timeline: [
      { time: '19:00', label: 'Ministerial Conclave', desc: 'EU High Representative opens final plenary session.', verified: true },
      { time: '22:30', label: 'Supply Chain Annex Ratified', desc: 'Clauses on critical semiconductor shipping resilience approved.', verified: true },
      { time: '01:00', label: 'Joint Communiqué Released', desc: 'Financial Times publishes official communique terms.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-E11B4',
      level: 'Veteran',
      trustScore: 162,
      approvedReports: 28,
      falseReports: 0,
      privateKyc: {
        realName: 'Elena Van Der Meer',
        email: 'elena.vdmeer@bru-press.eu',
        phone: '+32 2 299 1111',
        identityVerified: true,
        deviceFingerprint: 'DEV-BRU-7721'
      }
    },
    communityTrust: {
      trustVotes: 620,
      disputeVotes: 18,
      trustPercentage: 97
    },
    evidence: [
      {
        type: 'image',
        title: 'European Council Ministerial Signing Ceremony',
        url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
        caption: 'Formal signing ceremony at Justus Lipsius building, Brussels.'
      }
    ],
    tags: ['#EU', '#IndoPacific', '#TradeFramework', '#FinancialTimes', '#Economy']
  },
  {
    id: 'ev-california-wildfires',
    title: 'Wildfires force evacuation in parts of California',
    category: 'environmental',
    subcategory: 'ENVIRONMENT',
    severity: 'high',
    status: 'active',
    verificationStatus: 'VERIFIED',
    source: 'BBC',
    flag: '🇺🇸',
    location: {
      city: 'Oroville',
      state: 'California',
      country: 'United States',
      lat: 39.5138,
      lng: -121.5564,
      region: 'north-america'
    },
    timestamp: '8h ago',
    date: '2026-09-16',
    time: '22:45 UTC',
    isHotAlert: true,
    summary: 'Over 12,000 people told to leave as fires spread across northern California.',
    fullDescription: 'CAL FIRE has issued emergency evacuation orders for Butte County after dry wind gusts exceeding 45 mph rapidly expanded the Thompson Wildfire perimeter to over 5,000 acres, threatening residential power grids and watershed reservoirs.',
    timeline: [
      { time: '16:00', label: 'Ignition Reported', desc: 'Brush fire ignited along rural highway foothills.', verified: true },
      { time: '19:30', label: 'Red Flag Escalation', desc: 'Wind gusts spread fire across 3,000 acres; air tankers deployed.', verified: true },
      { time: '22:45', label: 'Mandatory Evacuations', desc: 'Butte County Sheriff orders 12,000 residents to evacuate immediately.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-W44C9',
      level: 'Veteran',
      trustScore: 155,
      approvedReports: 22,
      falseReports: 0,
      privateKyc: {
        realName: 'David Miller',
        email: 'd.miller.sac@norcal-journal.org',
        phone: '+1 916 555 0199',
        identityVerified: true,
        deviceFingerprint: 'DEV-SMF-9021'
      }
    },
    communityTrust: {
      trustVotes: 840,
      disputeVotes: 12,
      trustPercentage: 99
    },
    evidence: [
      {
        type: 'image',
        title: 'Thermal Aerial IR Scan - Foothill Blaze Perimeter',
        url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
        caption: 'Aerial infrared mapping showing rapid ridge expansion.'
      }
    ],
    tags: ['#CaliforniaWildfires', '#Oroville', '#CalFire', '#BBC', '#DisasterAlert']
  },
  {
    id: 'ev-301',
    title: 'US-Houthi talks in Oman regarding maritime security',
    category: 'conflict',
    subcategory: 'Diplomatic & Maritime Negotiations',
    severity: 'high',
    status: 'active',
    verificationStatus: 'VERIFIED',
    flag: '🇺🇸',
    location: {
      city: 'Muscat',
      state: 'Muscat Governorate',
      country: 'Oman',
      lat: 23.5859,
      lng: 58.4059,
      region: 'Middle East'
    },
    timestamp: '14 minutes ago',
    date: '2026-09-16',
    time: '18:12 UTC',
    summary: 'Direct closed-door mediation commences in Muscat addressing commercial navigation security guarantees and ceasefire protocols along the Bab-el-Mandeb and Red Sea lanes.',
    fullDescription: 'Envoys from Washington and regional stakeholders have convened in Muscat under Omani mediation. Discussions center on formal guarantees for unhindered passage of merchant shipping through the Bab-el-Mandeb strait in exchange for adjusted coastal surveillance perimeters.',
    timeline: [
      { time: '14:00', label: 'Delegations Arrive', desc: 'Omani diplomatic escorts receive bilateral envoys.', verified: true },
      { time: '17:30', label: 'Plenary Session', desc: 'Working groups review radar tracking telemetry and maritime safety protocols.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-M90V1',
      level: 'Virtuoso',
      trustScore: 192,
      approvedReports: 42,
      falseReports: 0
    },
    communityTrust: { trustVotes: 890, disputeVotes: 12, trustPercentage: 98 },
    isHotAlert: true,
    tickerHighlight: true,
    tags: ['#Oman', '#Maritime', '#RedSea', '#Diplomacy', '#Houthi']
  },
  {
    id: 'ev-302',
    title: 'Russian military operations in Donetsk Oblast',
    category: 'conflict',
    subcategory: 'Kinetic Frontline Operations',
    severity: 'critical',
    status: 'active',
    verificationStatus: 'VERIFIED',
    flag: '🇺🇦',
    hasHotReticle: true,
    location: {
      city: 'Donetsk Sector',
      state: 'Donetsk Oblast',
      country: 'Ukraine',
      lat: 48.0159,
      lng: 37.8028,
      region: 'Eastern Europe'
    },
    timestamp: '16 minutes ago',
    date: '2026-09-16',
    time: '18:10 UTC',
    summary: 'High-intensity artillery barrages and mechanized armor thrusts reported across the Avdiivka-Pokrovsk axis with active electronic warfare jamming.',
    fullDescription: 'Satellite and tactical thermal sensors observe sustained battalion-scale offensive thrusts along the central Donetsk salient. Intense artillery duels and UAV drone strikes are active across the contact line.',
    timeline: [
      { time: '16:00', label: 'Artillery Escalation', desc: 'Heavy rocket barrages register across frontline sensors.', verified: true },
      { time: '17:45', label: 'Air Defense Active', desc: 'Multiple tactical interceptor launches detected over the theater.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-U24K9',
      level: 'Virtuoso',
      trustScore: 198,
      approvedReports: 67,
      falseReports: 1
    },
    communityTrust: { trustVotes: 2430, disputeVotes: 45, trustPercentage: 98 },
    isHotAlert: true,
    tickerHighlight: true,
    tags: ['#Donetsk', '#Frontline', '#Artillery', '#Conflictly', '#Ukraine']
  },
  {
    id: 'ev-303',
    title: 'Russian tactical shifts in Lyman area',
    category: 'conflict',
    subcategory: 'Tactical Realignment',
    severity: 'high',
    status: 'active',
    verificationStatus: 'VERIFIED',
    flag: '🇺🇦',
    location: {
      city: 'Lyman',
      state: 'Donetsk Oblast',
      country: 'Ukraine',
      lat: 48.9867,
      lng: 37.8042,
      region: 'Eastern Europe'
    },
    timestamp: '16 minutes ago',
    date: '2026-09-16',
    time: '18:10 UTC',
    summary: 'Reconnaissance units identify rotational armor maneuvers and logistics realignment in the forested approaches north of Lyman.',
    fullDescription: 'Tactical drone feeds confirm regrouping of mechanized infantry elements in the Kreminna-Lyman sector. Counter-battery fire remains active along the Siverskyi Donets river crossings.',
    timeline: [
      { time: '15:20', label: 'Recon Incursion', desc: 'Forward spotters report armor realignment.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-L12P8',
      level: 'Veteran',
      trustScore: 135,
      approvedReports: 19,
      falseReports: 0
    },
    communityTrust: { trustVotes: 610, disputeVotes: 18, trustPercentage: 97 },
    isHotAlert: false,
    tickerHighlight: true,
    tags: ['#Lyman', '#TacticalShift', '#Kreminna', '#Artillery']
  },
  {
    id: 'ev-304',
    title: 'Ukrainian operation Vivaldi achieves breakthrough in southern sector',
    category: 'conflict',
    subcategory: 'Offensive Operations',
    severity: 'critical',
    status: 'active',
    verificationStatus: 'VERIFIED',
    flag: '🇺🇦',
    location: {
      city: 'Zaporizhzhia Axis',
      state: 'Zaporizhzhia',
      country: 'Ukraine',
      lat: 47.8388,
      lng: 35.1396,
      region: 'Eastern Europe'
    },
    timestamp: '18 minutes ago',
    date: '2026-09-16',
    time: '18:08 UTC',
    summary: 'Coordinated precision strike campaign utilizing combined arms breaks secondary defensive belts in the southern operational sector.',
    fullDescription: 'Operation codename Vivaldi launched synchronized FPV drone swarms and high-mobility artillery systems, penetrating fortified entrenchments along key logistics arteries.',
    timeline: [
      { time: '16:15', label: 'Breach Initiated', desc: 'Engineering units clear minefield corridors.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-V99X1',
      level: 'Virtuoso',
      trustScore: 188,
      approvedReports: 34,
      falseReports: 0
    },
    communityTrust: { trustVotes: 1540, disputeVotes: 32, trustPercentage: 98 },
    isHotAlert: true,
    tickerHighlight: true,
    tags: ['#OperationVivaldi', '#Zaporizhzhia', '#Breakthrough']
  },
  {
    id: 'ev-305',
    title: 'Major drone and missile attacks across Saudi Arabia',
    category: 'conflict',
    subcategory: 'Aerial Attacks & Air Defense',
    severity: 'critical',
    status: 'active',
    verificationStatus: 'VERIFIED',
    flag: '🇸🇦',
    hasHotReticle: true,
    location: {
      city: 'Riyadh & Eastern Province',
      state: 'Central Region',
      country: 'Saudi Arabia',
      lat: 24.7136,
      lng: 46.6753,
      region: 'Middle East'
    },
    timestamp: '1 hour ago',
    date: '2026-09-16',
    time: '17:26 UTC',
    summary: 'Sirens sounded in multiple Saudi regions following significant aerial attacks. Patriot and THAAD missile defense batteries engaged over 14 incoming projectiles.',
    fullDescription: 'Coordinated long-range drone waves and ballistic missiles targeted energy distribution substations and airport perimeters. Joint Defense Command confirmed nine intercepts over western Riyadh and five drone neutralizations near Ras Tanura.',
    timeline: [
      { time: '16:40', label: 'Air Raid Sirens', desc: 'Civil defense sirens triggered across metropolitan sectors.', verified: true },
      { time: '17:15', label: 'Kinetic Interceptions', desc: 'Defense batteries engage terminal dive trajectories.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-S55R2',
      level: 'Virtuoso',
      trustScore: 195,
      approvedReports: 51,
      falseReports: 1
    },
    communityTrust: { trustVotes: 3120, disputeVotes: 64, trustPercentage: 98 },
    isHotAlert: true,
    tickerHighlight: true,
    tags: ['#SaudiArabia', '#Riyadh', '#DroneAttack', '#AirDefense', '#Patriot']
  },
  {
    id: 'ev-306',
    title: 'Ukrainian strikes on Russian targets in Crimea and Donetsk',
    category: 'conflict',
    subcategory: 'Long-Range Missile Strikes',
    severity: 'critical',
    status: 'active',
    verificationStatus: 'VERIFIED',
    flag: '🇺🇦',
    location: {
      city: 'Sevastopol & Crimea',
      state: 'Crimea',
      country: 'Ukraine',
      lat: 44.6167,
      lng: 33.5254,
      region: 'Eastern Europe'
    },
    timestamp: '10 minutes ago',
    date: '2026-09-16',
    time: '18:16 UTC',
    summary: 'Ukrainian forces conducted precision strikes against an Su-24 aircraft staging facility in Crimea and a command UAV assembly depot in Donetsk.',
    fullDescription: 'Storm Shadow cruise missiles and indigenous long-range strike drones delivered concentrated warheads onto hardened aircraft revetments at Saky airfield and secondary command nodes in occupied Donetsk.',
    timeline: [
      { time: '17:50', label: 'Launch Telemetry', desc: 'Coastal radar arrays pick up low-altitude cruise profiles.', verified: true },
      { time: '18:10', label: 'Impact Confirmed', desc: 'Plumes of black smoke and secondary explosions documented by local spotters.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-K88Q1',
      level: 'Veteran',
      trustScore: 164,
      approvedReports: 29,
      falseReports: 0
    },
    communityTrust: { trustVotes: 1890, disputeVotes: 40, trustPercentage: 98 },
    isHotAlert: true,
    tickerHighlight: true,
    tags: ['#Crimea', '#Sevastopol', '#Airbase', '#PrecisionStrike']
  },
  {
    id: 'ev-307',
    title: '$180M Swiss Offshore Defense Kickback & Money Laundering Network Busted',
    category: 'corruption',
    subcategory: 'Offshore Money Laundering',
    severity: 'critical',
    status: 'investigating',
    verificationStatus: 'VERIFIED',
    sign: '💰',
    flag: '🇨🇭',
    location: {
      city: 'Zurich',
      state: 'Canton of Zurich',
      country: 'Switzerland',
      lat: 47.3769,
      lng: 8.5417,
      region: 'Western Europe'
    },
    timestamp: '45 minutes ago',
    date: '2026-09-16',
    time: '17:41 UTC',
    summary: 'Federal criminal police and FINMA freeze 14 numbered private banking accounts concealing $180M in illicit kickbacks funneled from international arms procurement contracts.',
    fullDescription: 'A cross-border forensic financial investigation spanning Zurich, Geneva, and Vaduz has seized shell entity registers, encrypted crypto cold storage vaults, and forged end-user certificates. Wire transfers linked to artillery shell and avionics component contracts were routed through nested Panamanian and Cypriot holding companies.',
    timeline: [
      { time: '08:00', label: 'FINMA Asset Freeze Order', desc: 'Emergency administrative restraining orders served on 4 private banking institutions.', verified: true },
      { time: '12:30', label: 'Premises Search', desc: 'Federal prosecutors seize encrypted servers and physical ledger safes in Paradeplatz.', verified: true },
      { time: '17:00', label: 'Formal Indictment Issued', desc: 'Indictments published under Swiss Anti-Money Laundering Act (AMLA).', verified: true }
    ],
    reporter: {
      alias: 'Reporter-CH09Z',
      level: 'Virtuoso',
      trustScore: 194,
      approvedReports: 45,
      falseReports: 0
    },
    communityTrust: { trustVotes: 1420, disputeVotes: 21, trustPercentage: 99 },
    categorySpecific: {
      corruption: {
        targetOrganization: 'Helvetic-Alpine Defense Capital Partners',
        allegationType: 'Nested Offshore Laundering & Procurement Bribes',
        financialAmount: '$180,000,000 (CHF 162M)',
        jurisdiction: 'Swiss Federal Prosecution Office / FINMA'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'Swiss Federal Department of Justice Press Release', url: '#', type: 'Official Judicial Bulletin' },
        { name: 'FINMA Enforcement Notice 2026-B89', url: '#', type: 'Financial Regulator' }
      ]
    },
    isHotAlert: true,
    tickerHighlight: true,
    tags: ['#Corruption', '#Switzerland', '#MoneyLaundering', '#Zurich', '#DefenseKickbacks', '#FINMA']
  },
  {
    id: 'ev-201',
    title: 'Severe Flash Flooding Submerges Central Jaipur Districts',
    category: 'calamity',
    subcategory: 'Flood',
    severity: 'critical',
    status: 'active',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      lat: 26.9124,
      lng: 75.7873,
      region: 'South Asia'
    },
    timestamp: '28m ago',
    date: '2026-09-16',
    time: '14:45 IST',
    summary: 'Relentless monsoon downpours have caused flash flooding across Jaipur, submerging arterial roads, displacing 18,000 residents, and prompting deployment of NDRF rescue boats.',
    fullDescription: 'Continuous torrential rainfall exceeding 185mm over 18 hours has overwhelmed the municipal drainage systems across Jaipur. Multiple central low-lying residential sectors, including Sanganer and parts of the Walled City, are facing severe inundation with water levels rising up to 2.4 meters. State Disaster Management authorities have dispatched three National Disaster Response Force (NDRF) rescue flotillas. Electricity supply has been preemptively disconnected in flooded grids to avert electrocution hazards.',
    timeline: [
      { time: '04:30', label: 'Cloudburst Warning', desc: 'Meteorological department issues red alert for eastern Rajasthan.', verified: true },
      { time: '08:15', label: 'Drainage Breach', desc: 'Major stormwater canals overflow onto Tonk Road and JLN Marg.', verified: true },
      { time: '11:40', label: 'NDRF Mobilization', desc: 'Three battalions deployed with rescue rafts and amphibious gear.', verified: true },
      { time: '14:20', label: 'Relief Centers Active', desc: '14 temporary relief shelters established in government schools.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-K29P4',
      level: 'Veteran',
      trustScore: 140,
      approvedReports: 21,
      falseReports: 0,
      privateKyc: {
        realName: 'Aarav Sharma',
        email: 'aarav.sharma.jpr@proton.me',
        phone: '+91 94140 88219',
        identityVerified: true,
        deviceFingerprint: 'DEV-IN-RJ-9921'
      }
    },
    communityTrust: {
      trustVotes: 512,
      disputeVotes: 14,
      trustPercentage: 97
    },
    categorySpecific: {
      flood: {
        waterLevel: '2.4 meters in low-lying sectors',
        rainfall: '185mm / 18h',
        evacuationStatus: 'Tier 3 Mandatory Evacuation',
        affectedPopulation: '18,000+ residents'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'Rajasthan Disaster Management Authority (RDMA)', url: '#', type: 'Official State Body' },
        { name: 'Field Spotter Ground Video Feed #81', url: '#', type: 'Direct Geotagged Footage' },
        { name: 'Central Water Commission Hydrology Buoy', url: '#', type: 'Sensor Telemetry' }
      ]
    },
    tags: ['#Flood', '#Jaipur', '#Rajasthan', '#HeavyRain', '#RescueOps', '#NDRF'],
    isHotAlert: true
  },
  {
    id: 'ev-202',
    title: '$42M Highway Procurement Bribery Ring Uncovered',
    category: 'corruption',
    subcategory: 'Procurement Fraud',
    severity: 'critical',
    status: 'investigating',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'New Delhi',
      state: 'Delhi NCR',
      country: 'India',
      lat: 28.6139,
      lng: 77.2090,
      region: 'South Asia'
    },
    timestamp: '1h 10m ago',
    date: '2026-09-16',
    time: '13:30 IST',
    summary: 'Anti-corruption bureau raids uncover an illicit financial network channeling $42M in kickbacks for interstate express highway construction contracts across 6 states.',
    fullDescription: 'Coordinated enforcement directorate raids across 24 corporate premises in New Delhi, Gurugram, and Mumbai have seized hard ledger records, encrypted offshore bank conduits, and shell company registries. Preliminary audit reports establish that substandard paving bitumen was certified through forged lab accreditation stamps while diversion accounts funneled kickbacks through Dubai and Mauritius corporate vehicles.',
    timeline: [
      { time: '06:00', label: 'Simultaneous Raids', desc: 'Enforcement teams execute 24 search warrants across NCR corporate corridors.', verified: true },
      { time: '09:45', label: 'Material Seizure', desc: 'Digital hard drives and physical offshore registry ledgers seized.', verified: true },
      { time: '13:00', label: 'Official Indictment Notice', desc: 'Charges framed under Prevention of Corruption Act and Money Laundering statutes.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-X7A91',
      level: 'Virtuoso',
      trustScore: 185,
      approvedReports: 36,
      falseReports: 0,
      privateKyc: {
        realName: 'Devika Singhania',
        email: 'd.singhania.investigative@tutanota.com',
        phone: '+91 98110 54321',
        identityVerified: true,
        deviceFingerprint: 'DEV-IN-DL-4029'
      }
    },
    communityTrust: {
      trustVotes: 789,
      disputeVotes: 23,
      trustPercentage: 97
    },
    categorySpecific: {
      corruption: {
        targetOrganization: 'Consortium for National Express Corridor Infra',
        allegationType: 'Kickback Funneling & Material Spec Tampering',
        financialAmount: '$42,500,000 (₹355 Crore)',
        jurisdiction: 'Central Vigilance Commission / Enforcement Directorate'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'Central Vigilance Commission Formal Docket 2026/09', url: '#', type: 'Judicial Document' },
        { name: 'Financial Intelligence Unit Audit Trail', url: '#', type: 'Forensic Audit' }
      ]
    },
    tags: ['#Corruption', '#NewDelhi', '#Expressway', '#EnforcementDirectorate', '#ScamWatch'],
    isHotAlert: true
  },
  {
    id: 'ev-203',
    title: 'Naval Skirmish & Drone Interceptions in Southern Red Sea Chokepoint',
    category: 'conflict',
    subcategory: 'Maritime Warfare',
    severity: 'critical',
    status: 'active',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'Bab-el-Mandeb',
      state: 'Red Sea Strait',
      country: 'Yemen',
      lat: 12.5833,
      lng: 43.3333,
      region: 'Middle East'
    },
    timestamp: '42m ago',
    date: '2026-09-16',
    time: '11:15 UTC',
    summary: 'International coalition naval vessels intercept three unmanned surface vessels and five anti-ship ballistic projectiles targeting commercial container shipping corridors.',
    fullDescription: 'A multi-axis maritime engagement occurred 35 nautical miles southwest of Mokha. Guided-missile destroyers operating in defensive patrol formations launched radar-guided interceptors neutralizing two drone boats packed with explosives and three approaching sea-skimming cruise missiles. All civilian merchant traffic in Transit Corridor Sector Bravo has been halted pending hydrographic sweep operations.',
    timeline: [
      { time: '09:10', label: 'Radar Warning Receiver Trigger', desc: 'Coastal defense telemetry radars detected firing sequences.', verified: true },
      { time: '09:35', label: 'Kinetic Interception', desc: 'Aegis combat system successfully tracks and destroys all incoming projectiles.', verified: true },
      { time: '11:00', label: 'Maritime Security Notice', desc: 'UKMTO issues Category 1 Critical Navigational Warning for Bab-el-Mandeb.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-N81QZ',
      level: 'Veteran',
      trustScore: 162,
      approvedReports: 28,
      falseReports: 1,
      privateKyc: {
        realName: 'Tariq Al-Mansoor',
        email: 't.mansoor.maritime@ciphermail.ch',
        phone: '+971 50 123 9988',
        identityVerified: true,
        deviceFingerprint: 'DEV-AE-DXB-7711'
      }
    },
    communityTrust: {
      trustVotes: 1240,
      disputeVotes: 48,
      trustPercentage: 96
    },
    categorySpecific: {
      conflict: {
        dangerLevel: 'Tier 1 Combat Zone',
        casualties: '0 naval, commercial crew secured in safe citadels',
        perimeter: 'Radius of 60 nautical miles from Bab-el-Mandeb bottleneck'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'United Kingdom Maritime Trade Operations (UKMTO)', url: '#', type: 'Official Maritime Authority' },
        { name: 'Combined Maritime Forces Public Dispatch', url: '#', type: 'Naval Command' }
      ]
    },
    tags: ['#RedSea', '#NavalCombat', '#ShippingAlert', '#BabElMandeb', '#Defense'],
    isHotAlert: true
  },
  {
    id: 'ev-204',
    title: 'Severe Groundwater Depletion Shuts Down 120 Borewells in Bengaluru IT Belt',
    category: 'environmental',
    subcategory: 'Water Scarcity',
    severity: 'high',
    status: 'active',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      lat: 12.9716,
      lng: 77.5946,
      region: 'South Asia'
    },
    timestamp: '2h 45m ago',
    date: '2026-09-16',
    time: '12:00 IST',
    summary: 'Critical aquifer levels drop below 1,600 feet across Whitefield and Bellandur, forcing corporate tech campuses to ration water and rely completely on emergency state water tankers.',
    fullDescription: 'Hydrogeological telemetry shows subterranean aquifers in Bengaluru’s Mahadevapura zone have experienced unprecedented drawdown rates. Over 120 institutional borewells have yielded sediment sludge, signaling complete aquifer exhaustion. The Karnataka State Water Board has activated emergency pipeline rationing while ordering commercial entities to treat and recirculate 100% of graywater.',
    timeline: [
      { time: '07:30', label: 'Borewell Telemetry Alert', desc: 'Automated pressure monitors report zero static head at 45 pump houses.', verified: true },
      { time: '10:15', label: 'Commercial Rationing Order', desc: 'District Collector caps non-essential water withdrawals.', verified: true },
      { time: '12:00', label: 'Emergency Tanker Fleet', desc: '300 civic tankers deployed to supply critical residential clusters.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-B19V5',
      level: 'Veteran',
      trustScore: 115,
      approvedReports: 14,
      falseReports: 0,
      privateKyc: {
        realName: 'Pooja Krishnan',
        email: 'p.krishnan.hydrology@proton.me',
        phone: '+91 98450 11223',
        identityVerified: true,
        deviceFingerprint: 'DEV-IN-KA-5501'
      }
    },
    communityTrust: {
      trustVotes: 442,
      disputeVotes: 19,
      trustPercentage: 96
    },
    categorySpecific: {
      environmental: {
        depthDrop: '1,650 ft subterranean depth',
        borewellsDried: '120 active civic & commercial borewells',
        rationingTier: 'Emergency Level 2 Commercial Freeze'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'Bangalore Water Supply & Sewerage Board (BWSSB)', url: '#', type: 'Municipal Agency' },
        { name: 'Indian Institute of Science Hydrology Lab Sensor Network', url: '#', type: 'Academic Sensor' }
      ]
    },
    tags: ['#WaterCrisis', '#Bengaluru', '#AquiferWatch', '#Karnataka', '#Drought'],
    isHotAlert: false
  },
  {
    id: 'ev-205',
    title: 'Transatlantic Subsea Fiber Cable Severed Near Azores Trench',
    category: 'technology',
    subcategory: 'Subsea Infrastructure',
    severity: 'critical',
    status: 'investigating',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'Ponta Delgada',
      state: 'Azores Region',
      country: 'Portugal',
      lat: 37.7412,
      lng: -25.6756,
      region: 'North Atlantic'
    },
    timestamp: '3h 15m ago',
    date: '2026-09-16',
    time: '08:45 UTC',
    summary: 'A 240 Tbps subsea fiber optic trunk linking Western Europe and North America suffered an abrupt physical severance at a depth of 3,200m, rerouting 38% of transatlantic IP transit.',
    fullDescription: 'Optical time-domain reflectometry (OTDR) localized an abrupt physical fiber fault 140km southwest of Sao Miguel Island at the Azores abyssal slope. Telecommunication consortia report substantial latency spikes across London-New York financial routing pipelines. Autonomous cable-repair vessel CS Sovereign has been dispatched from Brest, France, with ROVs to inspect the seabed for seismic rockslide or maritime anchor dragging damage.',
    timeline: [
      { time: '05:12', label: 'BGP Route Flapping', desc: 'Tier-1 transit providers detect catastrophic optical attenuation.', verified: true },
      { time: '06:00', label: 'Automated Reroute', desc: 'Traffic redirected through South Atlantic and Nordic bypass trunks.', verified: true },
      { time: '08:30', label: 'Repair Mission Launch', desc: 'Deep-sea cable ship sets sail with subsea grappling robotics.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-Z99K1',
      level: 'Virtuoso',
      trustScore: 192,
      approvedReports: 42,
      falseReports: 0,
      privateKyc: {
        realName: 'Helena Carvalho',
        email: 'h.carvalho.ocean@tuta.io',
        phone: '+351 912 345 678',
        identityVerified: true,
        deviceFingerprint: 'DEV-PT-AZR-1002'
      }
    },
    communityTrust: {
      trustVotes: 930,
      disputeVotes: 32,
      trustPercentage: 97
    },
    categorySpecific: {
      technology: {
        bandwidthImpacted: '240 Terabits per second',
        depthOfSeverance: '3,200 meters abyssal seabed',
        estimatedRepairTime: '7 to 12 days weather dependent'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'Submarine Telecoms Cable System Consortium', url: '#', type: 'Industry Consortium' },
        { name: 'Kentik Global BGP Internet Intelligence Feed', url: '#', type: 'Network Telemetry' }
      ]
    },
    tags: ['#SubseaCable', '#InternetOutage', '#Azores', '#FiberCut', '#TechInfrastructure'],
    isHotAlert: true
  },
  {
    id: 'ev-206',
    title: '500,000 March on Place de la Concorde in Nationwide Pension Strike',
    category: 'politics',
    subcategory: 'Civil Unrest',
    severity: 'high',
    status: 'active',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'Paris',
      state: 'Ile-de-France',
      country: 'France',
      lat: 48.8661,
      lng: 2.3211,
      region: 'Western Europe'
    },
    timestamp: '4h 10m ago',
    date: '2026-09-16',
    time: '13:00 CET',
    summary: 'Mass trade union mobilization gridlocks central Paris as public transport, sanitation workers, and healthcare workers demonstrate against austerity decrees.',
    fullDescription: 'A coalition of eight major trade unions has paralyzed public transportation across the Parisian metropolitan area. Barricades were erected near Boulevard Saint-Germain, and police deployed water cannons and tear gas around the perimeter of the National Assembly. Over 11,000 CRS riot police officers have been mobilized throughout the capital.',
    timeline: [
      { time: '09:00', label: 'Metro & Train Shutdown', desc: '90% of RER and metro lines suspended nationwide.', verified: true },
      { time: '11:30', label: 'Cortege Gathers', desc: 'Procession starts from Place d\'Italie advancing toward Concorde.', verified: true },
      { time: '13:15', label: 'Tear Gas Deployed', desc: 'Clashes reported on peripheral boulevards with multiple detentions.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-F44W2',
      level: 'Veteran',
      trustScore: 135,
      approvedReports: 19,
      falseReports: 1,
      privateKyc: {
        realName: 'Lucien Moreau',
        email: 'l.moreau.press@laposte.net',
        phone: '+33 6 78 90 12 34',
        identityVerified: true,
        deviceFingerprint: 'DEV-FR-PRS-3021'
      }
    },
    communityTrust: {
      trustVotes: 610,
      disputeVotes: 44,
      trustPercentage: 93
    },
    categorySpecific: {
      politics: {
        crowdEstimate: '500,000+ demonstrators in Paris, 1.8M nationwide',
        securityDeployment: '11,000 CRS & Gendarmerie personnel',
        transportImpact: 'Total shutdown of 12 Metro lines'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'Prefecture de Police de Paris Public Briefing', url: '#', type: 'Official State Source' },
        { name: 'Confederation Generale du Travail (CGT) Press Room', url: '#', type: 'Union Release' }
      ]
    },
    tags: ['#ParisProtests', '#StrikeWave', '#France', '#PensionReform', '#CivilUnrest'],
    isHotAlert: false
  },
  {
    id: 'ev-207',
    title: 'Interpol Busts $180M International Synthetic Opioid Smuggling Ring',
    category: 'crime',
    subcategory: 'Narcotics Trafficking',
    severity: 'high',
    status: 'contained',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'Rotterdam',
      state: 'South Holland',
      country: 'Netherlands',
      lat: 51.9244,
      lng: 4.4777,
      region: 'Western Europe'
    },
    timestamp: '5h 30m ago',
    date: '2026-09-16',
    time: '08:00 CET',
    summary: 'Operation Chimera leads to simultaneous raids in Rotterdam, Antwerp, and Hamburg, seizing 4.2 tons of precursor chemicals and detaining 29 transnational cartel operatives.',
    fullDescription: 'A 14-month joint task force comprising Dutch National Police, DEA Europe, and Europol intercepted maritime refrigerated containers concealed within fruit pulp shipments arriving from South America. High-throughput container scanners at Maasvlakte detected custom lead-lined compartment baffles containing high-purity synthetic opioid analogs capable of compounding over 150 million lethal doses.',
    timeline: [
      { time: '04:00', label: 'Vessel Docking', desc: 'Panamanian-flagged cargo carrier berths at Maasvlakte Terminal.', verified: true },
      { time: '05:30', label: 'Tactical Breach', desc: 'Armed tactical teams execute interdiction on three warehouse coordinates.', verified: true },
      { time: '07:45', label: 'Arrests Announced', desc: '29 suspects remanded in custody across three EU member states.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-H33M8',
      level: 'Veteran',
      trustScore: 154,
      approvedReports: 25,
      falseReports: 0,
      privateKyc: {
        realName: 'Klaas Van Dijk',
        email: 'k.vandijk.crimewatch@protonmail.com',
        phone: '+31 6 1122 3344',
        identityVerified: true,
        deviceFingerprint: 'DEV-NL-RTM-8092'
      }
    },
    communityTrust: {
      trustVotes: 512,
      disputeVotes: 12,
      trustPercentage: 98
    },
    categorySpecific: {
      crime: {
        contrabandVolume: '4.2 metric tons synthetic precursors',
        streetValue: '$180,000,000 estimated street yield',
        suspectsDetained: '29 individuals across 3 nations'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'Europol Headquarters The Hague Press Bulletin', url: '#', type: 'Law Enforcement Dispatch' },
        { name: 'Dutch Public Prosecution Service (OM)', url: '#', type: 'Judicial Entity' }
      ]
    },
    tags: ['#Interpol', '#Rotterdam', '#PortSecurity', '#DrugBust', '#Europol'],
    isHotAlert: false
  },
  {
    id: 'ev-208',
    title: 'Cluster of Novel Marburg-Like Hemorrhagic Fever Confirmed in Goma',
    category: 'health',
    subcategory: 'Pathogen Outbreak',
    severity: 'critical',
    status: 'active',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'Goma',
      state: 'North Kivu',
      country: 'Democratic Republic of the Congo',
      lat: -1.6741,
      lng: 29.2285,
      region: 'Central Africa'
    },
    timestamp: '6h ago',
    date: '2026-09-16',
    time: '10:00 CAT',
    summary: 'WHO Africa and INRB deploy rapid biosafety level 4 mobile isolation units after genomic sequencing confirms 14 cases of high-fatality filovirus transmission in peri-urban Goma.',
    fullDescription: 'The National Institute of Biomedical Research (INRB) in Kinshasa completed whole-genome sequencing on blood samples from an acute febrile outbreak in Goma. The pathogen exhibits 94% genetic homology to Marburg virus strains with enhanced pulmonary transmission signatures. Contact tracing teams are currently tracking 280 potential secondary contacts while border checkpoints with Rwanda have initiated thermal screening protocols.',
    timeline: [
      { time: '05:00', label: 'Genomic Alert', desc: 'High-throughput sequencing detects divergent filovirus clade.', verified: true },
      { time: '07:30', label: 'WHO Emergency Deployment', desc: 'Mobile containment laboratory and 5,000 viral PPE suits airlifted.', verified: true },
      { time: '09:45', label: 'Ring Vaccination Staging', desc: 'Experimental recombinant vaccine doses prepared for frontline medical workers.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-M11A7',
      level: 'Veteran',
      trustScore: 168,
      approvedReports: 31,
      falseReports: 0,
      privateKyc: {
        realName: 'Dr. Jean-Paul Mukendi',
        email: 'jp.mukendi.inrb@medecins.cd',
        phone: '+243 81 234 5678',
        identityVerified: true,
        deviceFingerprint: 'DEV-CD-GMA-9943'
      }
    },
    communityTrust: {
      trustVotes: 1045,
      disputeVotes: 28,
      trustPercentage: 97
    },
    categorySpecific: {
      health: {
        laboratoryConfirmed: '14 patients in biocontainment',
        caseFatalityRate: '57% preliminary inpatient mortality',
        contactsTraced: '280 individuals under active surveillance'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'World Health Organization (WHO) Africa Regional Office', url: '#', type: 'Global Health Body' },
        { name: 'Institut National de Recherche Biomedicale (INRB)', url: '#', type: 'National Research Lab' }
      ]
    },
    tags: ['#Marburg', '#OutbreakWatch', '#WHO', '#Goma', '#Biohazard', '#AfricaHealth'],
    isHotAlert: true
  },
  {
    id: 'ev-209',
    title: 'Unverified Allegation of Toxic Industrial Byproduct Dumping in Vapi River',
    category: 'environmental',
    subcategory: 'Chemical Pollution',
    severity: 'medium',
    status: 'investigating',
    verificationStatus: 'UNDER_REVIEW',
    location: {
      city: 'Vapi',
      state: 'Gujarat',
      country: 'India',
      lat: 20.3714,
      lng: 72.9044,
      region: 'South Asia'
    },
    timestamp: '7h 15m ago',
    date: '2026-09-16',
    time: '09:15 IST',
    summary: 'Rookie field report alleges illegal nocturnal discharge of chemical dye effluents directly into the Kolak river basin; environmental inspectors currently collecting water samples.',
    fullDescription: 'Ground eyewitnesses in industrial sector GIDC Vapi documented reddish frothing water and pungent chemical fumes along the Kolak river bank during early morning hours. Water samples have been submitted to the State Pollution Control Board for gas chromatography testing. Because this report originated from a Rookie reporter, administrative verification and lab telemetry are pending before full publication clearance.',
    timeline: [
      { time: '03:30', label: 'Discharge Observed', desc: 'Nocturnal tanker truck seen discharging through auxiliary drainage conduit.', verified: false },
      { time: '06:00', label: 'Field Submission Filed', desc: 'Rookie reporter uploads geotagged video and water discoloration photos.', verified: true },
      { time: '08:30', label: 'PCB Inspectors Dispatched', desc: 'Pollution control officers arrive on-site to collect chemical sample bottles.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-R09V3',
      level: 'Rookie',
      trustScore: 20, // Rookie level: 0 - 49
      approvedReports: 2,
      falseReports: 0,
      privateKyc: {
        realName: 'Chirag Patel',
        email: 'chirag.patel.vapi@gmail.com',
        phone: '+91 99090 12345',
        identityVerified: true,
        deviceFingerprint: 'DEV-IN-GJ-1029'
      }
    },
    communityTrust: {
      trustVotes: 112,
      disputeVotes: 24,
      trustPercentage: 82
    },
    categorySpecific: {
      environmental: {
        chemicalObserved: 'Azo dye effluents and heavy metal sludge suspected',
        waterbody: 'Kolak River Basin',
        inspectionStage: 'Spectroscopy lab results awaited'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
      ],
      sources: [
        { name: 'Field Spotter Geotagged Video #112', url: '#', type: 'Citizen Video' },
        { name: 'Gujarat Pollution Control Board Docket in Progress', url: '#', type: 'Agency Inquiry' }
      ]
    },
    tags: ['#Pollution', '#Vapi', '#Gujarat', '#ChemicalWaste', '#CleanWater'],
    isHotAlert: false
  },
  {
    id: 'ev-210',
    title: 'Magnitude 6.8 Offshore Earthquake Shakes Honshu Coast Near Sendai',
    category: 'calamity',
    subcategory: 'Earthquake',
    severity: 'high',
    status: 'contained',
    verificationStatus: 'VERIFIED',
    location: {
      city: 'Sendai',
      state: 'Miyagi Prefecture',
      country: 'Japan',
      lat: 38.2682,
      lng: 140.8694,
      region: 'East Asia'
    },
    timestamp: '8h 20m ago',
    date: '2026-09-16',
    time: '18:10 JST',
    summary: 'A subduction zone earthquake at a focal depth of 45km triggered automated Shinkansen bullet train emergency braking and a 0.5m tsunami advisory, which was subsequently lifted.',
    fullDescription: 'The Japan Meteorological Agency (JMA) recorded a seismic event measuring M6.8 on the moment magnitude scale with an epicenter 60km offshore Miyagi Prefecture. Seismic intensity reached Shindo 5-upper in Sendai city center. Critical infrastructure, including Onagawa nuclear power plant safety systems, completed automatic scram checks with zero radiological anomalies detected.',
    timeline: [
      { time: '18:10', label: 'P-Wave Detection', desc: 'EEW alert broadcasts to millions of cellular handsets 14 seconds prior to S-wave.', verified: true },
      { time: '18:12', label: 'Shinkansen Stop', desc: 'Power cut to Tohoku Shinkansen tracks stops 8 high-speed trains safely.', verified: true },
      { time: '19:40', label: 'Advisory Cleared', desc: 'Minor 30cm wave crest recorded at Ishinomaki port with no damage.', verified: true }
    ],
    reporter: {
      alias: 'Reporter-T52J9',
      level: 'Virtuoso',
      trustScore: 198,
      approvedReports: 49,
      falseReports: 0,
      privateKyc: {
        realName: 'Kenji Takahashi',
        email: 'k.takahashi.seismo@tohoku-u.ac.jp',
        phone: '+81 90 1234 5678',
        identityVerified: true,
        deviceFingerprint: 'DEV-JP-SND-4401'
      }
    },
    communityTrust: {
      trustVotes: 1420,
      disputeVotes: 8,
      trustPercentage: 99
    },
    categorySpecific: {
      calamity: {
        magnitude: 'M 6.8 Moment Magnitude',
        depth: '45.0 km subduction fault',
        tsunamiStatus: 'Advisory lifted at 19:40 JST'
      }
    },
    evidence: {
      images: [
        'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
      ],
      sources: [
        { name: 'Japan Meteorological Agency (JMA) Seismological Bulletin', url: '#', type: 'National Meteorological Agency' },
        { name: 'USGS Earthquake Hazards Program Event #us7000m99z', url: '#', type: 'Global Seismology' }
      ]
    },
    tags: ['#Earthquake', '#Sendai', '#Japan', '#JMA', '#SeismicAlert'],
    isHotAlert: true
  }
];

export const REPORTER_TIERS = {
  ROOKIE: {
    name: 'Rookie',
    min: 0,
    max: 49,
    badgeColor: '#94A3B8',
    description: 'All reports require mandatory Admin review and verification before publishing.',
    autoPublish: false
  },
  VETERAN: {
    name: 'Veteran',
    min: 50,
    max: 169,
    badgeColor: '#38BDF8',
    description: 'Demonstrated history of credible reporting; standard admin verification workflow.',
    autoPublish: false
  },
  VIRTUOSO: {
    name: 'Virtuoso',
    min: 170,
    max: 200,
    badgeColor: '#F59E0B',
    description: 'Highest trust echelon; trusted for rapid intelligence corroboration.',
    autoPublish: true // For low risk; sensitive still reviewed
  }
};

// Tactical Affected Regions for Earth Hologram Highlighting
export const AFFECTED_REGIONS = [
  {
    id: 'russia-zone',
    name: 'Russian Federation',
    status: 'High Combat Alert / Mobilized Forces',
    severity: 'critical',
    color: '#EF4444',
    fillColor: 'rgba(239, 68, 68, 0.26)',
    strokeColor: '#FF2A4D',
    center: { lat: 58.0, lng: 50.0 },
    // Approximate bounding polygon in [lng, lat]
    polygon: [
      [28, 60], [33, 68], [45, 68], [60, 68], [75, 73], [100, 75], [135, 72], [165, 65],
      [175, 62], [160, 52], [140, 50], [132, 43], [120, 50], [100, 52], [85, 51], [60, 51],
      [50, 54], [40, 48], [38, 47], [35, 52], [30, 56], [28, 60]
    ]
  },
  {
    id: 'ukraine-zone',
    name: 'Ukraine / Frontline Sectors',
    status: 'Active Kinetic Combat Zone',
    severity: 'critical',
    color: '#EF4444',
    fillColor: 'rgba(239, 68, 68, 0.38)',
    strokeColor: '#FF4D4D',
    center: { lat: 48.5, lng: 35.0 },
    polygon: [
      [22, 48], [24, 51.5], [33, 52.3], [38, 50], [39.5, 48.5], [37, 46], [33.5, 44.5], [30, 46.5], [26, 48], [22, 48]
    ]
  },
  {
    id: 'middle-east-zone',
    name: 'Red Sea & Arabian Peninsula',
    status: 'Aerial Missile Interceptions & Naval Strikes',
    severity: 'critical',
    color: '#F97316',
    fillColor: 'rgba(249, 115, 22, 0.28)',
    strokeColor: '#FF7A00',
    center: { lat: 21.0, lng: 45.0 },
    polygon: [
      [34, 31], [42, 32], [50, 29], [56, 25], [59, 22], [54, 16], [45, 12], [42, 14], [38, 20], [34, 27], [34, 31]
    ]
  },
  {
    id: 'switzerland-corruption-zone',
    name: 'Zurich Offshore Financial Hub',
    status: 'Federal Enforcement / $180M Asset Freeze',
    severity: 'high',
    color: '#F59E0B',
    fillColor: 'rgba(245, 158, 11, 0.28)',
    strokeColor: '#FBBF24',
    center: { lat: 47.37, lng: 8.54 },
    polygon: [
      [6.0, 47.8], [10.5, 47.8], [10.5, 45.8], [6.0, 45.8], [6.0, 47.8]
    ]
  },
  {
    id: 'india-delhi-procurement-zone',
    name: 'National Capital Region',
    status: 'Anti-Corruption Bureau Raid Nexus ($42M)',
    severity: 'high',
    color: '#F59E0B',
    fillColor: 'rgba(245, 158, 11, 0.25)',
    strokeColor: '#FBBF24',
    center: { lat: 28.6, lng: 77.2 },
    polygon: [
      [75.0, 30.5], [79.0, 30.5], [79.0, 26.5], [75.0, 26.5], [75.0, 30.5]
    ]
  }
];

// Tactical Country Monospace HUD Labels for the Globe
export const COUNTRY_LABELS = [
  { name: 'RUSSIA', lat: 56.5, lng: 44.0, isAffected: true, color: '#FF6B6B' },
  { name: 'UKRAINE', lat: 49.2, lng: 31.5, isAffected: true, color: '#FF8787' },
  { name: 'POLAND', lat: 52.0, lng: 19.5, color: '#94A3B8' },
  { name: 'GERMANY', lat: 51.0, lng: 10.5, color: '#94A3B8' },
  { name: 'SWITZERLAND', lat: 46.8, lng: 8.2, isCorruption: true, color: '#FBBF24' },
  { name: 'ROMANIA', lat: 45.9, lng: 24.9, color: '#94A3B8' },
  { name: 'MOLDOVA', lat: 47.0, lng: 28.8, color: '#94A3B8' },
  { name: 'TURKEY', lat: 39.0, lng: 35.0, color: '#94A3B8' },
  { name: 'MIDDLE EAST', lat: 24.0, lng: 45.0, isAffected: true, color: '#FFA94D' },
  { name: 'EGYPT', lat: 26.8, lng: 30.8, color: '#94A3B8' },
  { name: 'INDIA', lat: 22.0, lng: 79.0, isAffected: true, color: '#FBBF24' },
  { name: 'FRANCE', lat: 46.6, lng: 2.2, color: '#94A3B8' },
  { name: 'NORWAY', lat: 61.5, lng: 8.5, color: '#94A3B8' },
  { name: 'SWEDEN', lat: 62.0, lng: 15.0, color: '#94A3B8' },
  { name: 'BELARUS', lat: 53.7, lng: 27.9, color: '#94A3B8' },
  { name: 'IRAN', lat: 32.4, lng: 53.6, color: '#94A3B8' }
];

// Rotating Diamond Tactical Reticles (Conflictly Hotspot Indicators)
export const HOT_RETICLES = [
  {
    id: 'reticle-donetsk',
    name: 'Donetsk Combat Frontline',
    lat: 48.0159,
    lng: 37.8028,
    color: '#EF4444',
    label: 'DONETSK THEATER'
  },
  {
    id: 'reticle-mideast',
    name: 'Red Sea Defense Corridor',
    lat: 21.5,
    lng: 44.0,
    color: '#EF4444',
    label: 'MIDDLE EAST THEATER'
  },
  {
    id: 'reticle-delhi',
    name: 'NCR Bribery Conduit',
    lat: 28.6139,
    lng: 77.2090,
    color: '#F59E0B',
    label: 'CORRUPTION HUB'
  },
  {
    id: 'reticle-zurich',
    name: 'Swiss Offshore Banking Nexus',
    lat: 47.3769,
    lng: 8.5417,
    color: '#F59E0B',
    label: 'OFFSHORE SEIZURE'
  }
];

// Top Predictions Data matching Conflictly UI
export const TOP_PREDICTIONS = [
  {
    id: 'pred-1',
    category: 'MIL',
    votes: '321 votes',
    views: '1860',
    question: 'Will North Korea conduct a nuclear test in 2026?',
    yesPercent: 82.7,
    noPercent: 17.3
  },
  {
    id: 'pred-2',
    category: 'MARITIME',
    votes: '245 votes',
    views: '1410',
    question: 'Will Red Sea maritime shipping traffic normalize before Q4 2026?',
    yesPercent: 28.4,
    noPercent: 71.6
  }
];

// Defense Stocks, Commodities & Forex Data matching Highlights UI
export const MARKETS_DATA = {
  stocks: [
    { name: 'S&P 500 (US)', price: '6,653.98', rawPrice: 6653.98, change: '+0.82%', isPositive: true },
    { name: 'NASDAQ (US)', price: '22,484.72', rawPrice: 22484.72, change: '+1.14%', isPositive: true },
    { name: 'Dow Jones (US)', price: '46,315.27', rawPrice: 46315.27, change: '+0.62%', isPositive: true },
    { name: 'FTSE 100 (UK)', price: '9,193.24', rawPrice: 9193.24, change: '+0.41%', isPositive: true },
    { name: 'DAX (Germany)', price: '23,510.48', rawPrice: 23510.48, change: '+0.58%', isPositive: true },
    { name: 'Nikkei 225 (Japan)', price: '45,839.24', rawPrice: 45839.24, change: '+1.02%', isPositive: true },
    { name: 'Hang Seng (HK)', price: '17,826.63', rawPrice: 17826.63, change: '-0.36%', isPositive: false }
  ],
  commodities: [
    { name: 'Gold', icon: 'Coins', price: '4,389.50', rawPrice: 4389.50, change: '+1.31%', isPositive: true, color: '#F59E0B' },
    { name: 'Brent Crude Oil', icon: 'Fuel', price: '105.44', rawPrice: 105.44, change: '-3.04%', isPositive: false, color: '#EF4444' },
    { name: 'Wheat', icon: 'Wheat', price: '724.25', rawPrice: 724.25, change: '-0.58%', isPositive: false, color: '#EF4444' },
    { name: 'Natural Gas', icon: 'Flame', price: '3.12', rawPrice: 3.12, change: '+0.77%', isPositive: true, color: '#10B981' },
    { name: 'Silver', icon: 'Sparkles', price: '52.36', rawPrice: 52.36, change: '+0.38%', isPositive: true, color: '#94A3B8' },
    { name: 'Copper', icon: 'Disc', price: '4.52', rawPrice: 4.52, change: '+0.41%', isPositive: true, color: '#F97316' }
  ],
  forex: [
    { pair: 'EUR/USD', price: '1.1042', rawPrice: 1.1042, change: '+0.28%', isPositive: true },
    { pair: 'USD/JPY', price: '149.32', rawPrice: 149.32, change: '-0.16%', isPositive: false },
    { pair: 'GBP/USD', price: '1.3187', rawPrice: 1.3187, change: '+0.34%', isPositive: true },
    { pair: 'USD/CHF', price: '0.8574', rawPrice: 0.8574, change: '-0.21%', isPositive: false },
    { pair: 'AUD/USD', price: '0.6732', rawPrice: 0.6732, change: '+0.45%', isPositive: true }
  ]
};

// Geodesic Cyber Arcs connecting major epicenters on 3D Globe
export const GLOBE_ARCS = [
  {
    id: 'arc-mideast-europe',
    startLat: 31.2968,
    startLng: 34.2455,
    endLat: 50.8503,
    endLng: 4.3517,
    color: '#EF4444' // Red
  },
  {
    id: 'arc-taiwan-us',
    startLat: 23.6978,
    startLng: 120.9605,
    endLat: 37.7749,
    endLng: -122.4194,
    color: '#00F2FE' // Cyan
  },
  {
    id: 'arc-mideast-asia',
    startLat: 31.2968,
    startLng: 34.2455,
    endLat: 35.6762,
    endLng: 139.6503,
    color: '#F59E0B' // Amber
  },
  {
    id: 'arc-europe-us',
    startLat: 50.8503,
    startLng: 4.3517,
    endLat: 40.7128,
    endLng: -74.0060,
    color: '#3B82F6' // Blue
  },
  {
    id: 'arc-southasia-mideast',
    startLat: 28.6139,
    startLng: 77.2090,
    endLat: 31.2968,
    endLng: 34.2455,
    color: '#10B981' // Green
  }
];

// Region definitions for region filter dropdown
export const REGIONS = [
  { id: 'all', name: 'All Regions' },
  { id: 'middle-east', name: 'Middle East' },
  { id: 'asia-pacific', name: 'Asia-Pacific' },
  { id: 'europe', name: 'Europe' },
  { id: 'north-america', name: 'North America' },
  { id: 'south-america', name: 'South America' },
  { id: 'africa', name: 'Africa' }
];

// Continent labels rendered in 3D / HUD space
export const CONTINENT_LABELS = [
  { name: 'NORTH AMERICA', lat: 46, lng: -100 },
  { name: 'SOUTH AMERICA', lat: -16, lng: -60 },
  { name: 'EUROPE', lat: 53, lng: 16 },
  { name: 'AFRICA', lat: 6, lng: 22 },
  { name: 'ASIA', lat: 44, lng: 94 },
  { name: 'MIDDLE EAST', lat: 27, lng: 44 }
];

// Strategic Briefings Data
export const BRIEFINGS_DATA = [
  {
    id: 'br-1',
    title: 'Daily Strategic Intelligence Brief: Red Sea & Levantine Escalation',
    date: '2026-09-17',
    classification: 'TOP-LEVEL OPEN INTELLIGENCE',
    summary: 'Sustained kinetic engagements in the southern Levantine theatre coincide with maritime security reassessments across Bab-el-Mandeb. Commodity markets signal price pressures on crude and grain freight corridors.',
    highlights: [
      'Gaza tactical ground advances reach high escalation threshold with regional spillover alert',
      'Muscat mediation channel attempts to secure safe transit protocols for commercial cargo',
      'Brent Crude volatility index expands +3.2% week-on-week'
    ],
    author: 'Strategic Threat Assessment Group'
  },
  {
    id: 'br-2',
    title: 'Indo-Pacific Trade Architecture & Semiconductor Supply Resilience',
    date: '2026-09-17',
    classification: 'ECONOMIC SECURITY ASSIGNMENT',
    summary: 'European Union and Indo-Pacific ministerial delegates ratify a mutual supply security framework designed to safeguard critical rare-earth logistics and semiconductor fabrication nodes.',
    highlights: [
      'Bilateral tech export harmonization signed across 14 member jurisdictions',
      'Taiwan Strait naval alert triggers automated inventory buffer accumulation',
      'Nikkei and DAX reflect positive market absorption of the accord'
    ],
    author: 'Global Macro Analysis Desk'
  },
  {
    id: 'br-3',
    title: 'North American Critical Infrastructure & Climate Risk Vector',
    date: '2026-09-17',
    classification: 'ENVIRONMENTAL INTELLIGENCE',
    summary: 'High heat domes combined with dry downslope wind gusts triggered acute wildfire perimeters across Northern California, stressing regional emergency logistics and power distribution corridors.',
    highlights: [
      'Oroville Thompson Fire threatens secondary high-voltage transmission lines',
      'Atmospheric monitoring indicates particulate dispersion toward central valleys',
      'Federal inter-agency staging initiated for water tender replenishment'
    ],
    author: 'Crisis Response Synthesis Unit'
  }
];


