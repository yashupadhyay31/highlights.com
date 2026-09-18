# highlights.com — Global Real-Time Event Intelligence Platform

> **EventGrid Specification v2.0 Implementation**  
> Inspired by the cybernetic, immersive 3D tactical aesthetics of `conflictly.com`.

---

## 🌍 Overview

**`highlights.com`** is a global real-time event intelligence and 3D visualization platform designed to structure, categorize, verify, rank, and visually present real-world events across an interactive 3D globe.

The platform combines:
- **3D Interactive Geoid Globe** with category-coded glowing markers and radar pulse beacons
- **2D Equirectangular Tactical Map Projection**
- **Deep Event Intelligence Dossiers** with chronological timelines, evidence galleries, and structured telemetry
- **Dual Trust System**: Distinct separation of Anonymous Reporter Reputation (0–200 pts) and Community Event Consensus (% Trust vs % Disputed)
- **Structured Field Reporter Intake** with dynamic category-adaptive fields
- **AI-Assisted Metadata Extraction** (suggested tags, executive summary, duplicate similarity rating)
- **Field Reporter Anonymity Protocol** (`Reporter-XXXX` pseudonyms)
- **Admin Intelligence Moderation Center** & Confidential KYC Identity Vault
- **Privacy-Centric Location Proximity Radar** (Haversine distance calculation)
- **Breaking Alert Ticker** for high-impact critical crises

---

## 🛠️ Tech Stack & Constraints

- **Development Constraint**: ₹0 (Zero Budget)
- **Frontend Architecture**: React 19 + Vite + Three.js + Lucide Icons + Custom Modern CSS Design System
- **State Management**: React Context (`AppContext.jsx`) with multi-role state simulation
- **Deployment**: Localhost (`http://localhost:5173/`)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🧭 Interactive Features & Key User Flows

### 1. 3D Globe Navigation
- **Orbit & Zoom**: Click and drag on the sphere to rotate; use the mouse wheel to zoom in and out.
- **Auto-Rotation**: Toggle auto-rotation using the circular arrow button in the header.
- **Marker Hover**: Hover over any glowing beacon on the globe to preview the HUD hover card.
- **Camera Fly-To**: Click on any marker, search result, or breaking alert to fly the 3D camera directly to its coordinates.
- **2D / 3D Toggle**: Switch between the 3D globe and the 2D flat grid map with the `2D Map` / `3D Globe` button in the header.

### 2. Event Intelligence Dossier
- Click on any event on the globe or from the left sidebar feed to open the sliding intelligence drawer.
- Explore the **Chronological Incident Timeline** documenting the step-by-step evolution of the story.
- Click on photographic evidence thumbnails to open the full-screen image lightbox.
- Inspect the **Dual Trust Evaluation System**:
  - Reporter Reputation score and tier badge.
  - Community Consensus ratio and live voting buttons.

### 3. Multi-Role Switcher (Header Simulator)
Switch roles instantly in the top-right header dropdown:
1. **Guest Explorer**: Read-only public access. Voting or submitting triggers an authentication prompt.
2. **Registered User**: Vote on community event trust (`Verify / Trust` or `Dispute`) with real-time percentage updates.
3. **Field Reporter**:
   - Access the **Reputation HUD** to monitor your 0–200 Trust Score gauge across **Rookie**, **Veteran**, and **Virtuoso** tiers.
   - Access the **Structured Report Form** to submit new field reports with live AI metadata extraction.
4. **Admin Moderator**:
   - Access the **Admin Moderation Desk** to review pending reports from Rookie/Veteran reporters.
   - Perform `Approve & Publish`, `Reject as False` (-25 pts penalty), or `Request Correction`.
   - Access the **Confidential Reporter Identity Vault** displaying protected KYC records (real names, emails, device signatures).

### 4. Proximity Radar ("Near Me")
- Click **Near Me** in the header.
- Authorize browser location or choose a strategic regional hub (e.g. Jaipur/Delhi, Bengaluru, Paris, Tokyo).
- Adjust the scan perimeter slider (100km to 8,000km) to discover nearby events sorted by geodesic distance.

---

## 📁 Project Structure

```
highlights.com/
├── dist/                      # Production build output
├── index.html                 # HTML entry point with tactical fonts & favicon
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── src/
│   ├── main.jsx               # React DOM root
│   ├── App.jsx                # Main HUD assembly & layout
│   ├── index.css              # Cybernetic dark tactical design system
│   ├── context/
│   │   └── AppContext.jsx     # Global state, filtering, voting, and role management
│   ├── data/
│   │   └── mockEvents.js      # Global event database across all 8+ EventGrid categories
│   └── components/
│       ├── Header.jsx         # Navigation, omnibar search, and role switcher
│       ├── AlertTicker.jsx    # Breaking alert banner with instant camera focus
│       ├── Globe3D.jsx        # Three.js 3D interactive globe with atmosphere shader
│       ├── TacticalMap2D.jsx  # 2D flat equirectangular projection map mode
│       ├── FilterSidebar.jsx  # Intelligence category filters and tactical event feed
│       ├── HoverCard.jsx      # 3D marker hover preview card
│       ├── EventDossier.jsx   # Slide-out intelligence detail drawer & trust voting
│       ├── ReporterSubmitModal.jsx  # Structured intake form with AI extraction preview
│       ├── ReporterDashboard.jsx    # 0–200 Trust score tracker & tier progress
│       ├── AdminModerationModal.jsx # Moderation queue & confidential KYC vault
│       ├── NearbyModal.jsx    # Geolocation radar with Haversine distance calculations
│       └── AuthModal.jsx      # Role sign-in & permission unlock modal
└── README.md
```

---

## 🔜 Next Steps: Backend Phase

When you are ready to proceed with the backend rebuild:
1. **Express & Node.js API server** in a `server/` directory.
2. **MongoDB Atlas** database schemas:
   - `User` & `FieldReporterProfile` (isolating private KYC fields from public queries)
   - `Event` with geospatial 2dsphere indexing for `$near` queries
   - `TrustVote` (one vote per registered user)
   - `EventTimeline` & `MediaSources`
3. **AI Integration Service** (categorization, entity extraction, and similarity check)
4. **JWT Authentication & Role-Based Access Control** (Guest, User, Reporter, Admin)
