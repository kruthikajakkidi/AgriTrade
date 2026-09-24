# 🌾 AgriTrade — Farm Produce Procurement & Supply Chain Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-forest.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-teal.svg)](https://tailwindcss.com/)

**AgriTrade** is a modern, end-to-end digital agricultural procurement and supply chain platform designed to connect **Farmers, Collection Center Managers, Quality Inspectors, Enterprise Buyers, Logistics Coordinators, and Platform Administrators** in one unified ecosystem.

---

## 🌟 Key Highlights

* **Soft, Farmer-Friendly & Enterprise UI**: Designed with clean typography (Inter), soft stone & emerald accents, and intuitive workflows.
* **Econometric ML Crop Price Predictor**: Calculates real-time spot valuation per kg and quintal based on Mandi benchmarks, moisture percentage, AGMARK grade, and seasonality, comparing against government MSP floors.
* **Role-Based Authentication**: Dedicated Login and Registration pages customized for all 6 stakeholder roles with 1-click test credentials.
* **Centralized Accurate Produce Photography**: High-resolution, accurate crop photography for Rice, Wheat, Cotton, Tomato, Onion, Maize, Potato, Chilli, Pulses, Mustard, and Soybean.
* **National AGMARK Quality Testing**: Moisture, grain defect, and foreign-matter parameter calibration paired with computer-vision grading.
* **Climate Warehouse Bay Tracking**: Real-time tonnage utilization (67 / 100 Tons) across climate-controlled bays (A1–B3).
* **Cold-Chain Logistics GPS Telemetry**: Real-time route tracking, reefer temperature monitoring (4.2°C), and automated waypoint check-ins.
* **Farm-to-Fork Traceability**: Digital QR code verification certificates for consumers and buyers.

---

## 🏗️ Project Architecture

```
level2/
├── client/                      # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/              # AI quality prediction cards
│   │   │   ├── common/          # StatusBadge, QRCodeModal, AboutModal, etc.
│   │   │   ├── layout/          # Navbar, Sidebar, MobileBottomNav
│   │   │   └── ml/              # CropPricePredictor component
│   │   ├── context/             # AuthContext, AppDataContext
│   │   ├── pages/
│   │   │   ├── Admin/           # Admin executive analytics & governance
│   │   │   ├── Auth/            # Role-based Login & Register
│   │   │   ├── Buyer/           # Marketplace & Purchase Order tracking
│   │   │   ├── CollectionCenter/# Intake scale & warehouse bay grid
│   │   │   ├── Farmer/          # Farmer dashboard, Sell Wizard, Settlements
│   │   │   ├── Inspector/       # Quality testing lab station
│   │   │   ├── Logistics/       # Route GPS visualizer & fleet tracking
│   │   │   ├── Traceability/    # Public QR traceability certificate
│   │   │   ├── LandingPage.jsx  # Homepage
│   │   │   └── ProduceLotDetails.jsx
│   │   └── utils/               # Crop image registry & helpers
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Node.js + Express backend
│   ├── src/
│   │   ├── config/              # Resilient JSON & Mongo DataStore
│   │   ├── data/                # Seed lots, buyers, warehouses, shipments
│   │   ├── routes/              # REST API endpoints & state machine
│   │   ├── services/            # Econometric Crop Price ML model
│   │   └── index.js             # Main server app
│   ├── server.js                # Convenience root entry point
│   └── package.json
├── package.json                 # Monorepo root script runner
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)

### 1. Installation

Clone the repository and install all dependencies:

```bash
git clone https://github.com/kruthikajakkidi/AgriTrade.git
cd AgriTrade

# Install root dependencies
npm install

# Install server and client dependencies
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Running in Development Mode

You can run both backend and frontend concurrently:

```bash
# From the root directory:
npm run dev
```

Or start them individually in separate terminals:

**Backend Server (Port 5000):**
```bash
cd server
npm start
# or: node server.js
```

**Frontend Client (Port 5173):**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---



## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/crops/images` | Commodity photograph registry |
| `POST` | `/api/ml/predict-price` | Econometric ML crop price valuation |
| `GET` | `/api/ml/price-trends` | 30-day historical commodity trend |
| `GET` | `/api/lots` | All produce lots |
| `POST` | `/api/lots` | Register new produce lot |
| `POST` | `/api/lots/:id/transition` | Advance lot through state machine |
| `POST` | `/api/lots/:id/inspect` | Record AGMARK test parameters & grade |
| `GET` | `/api/warehouse` | Warehouse capacity & bays layout |
| `GET` | `/api/shipments` | Fleet routes and GPS telemetry |
| `GET` | `/api/orders` | Purchase orders (POs) |
| `GET` | `/api/settlements` | Farmer escrow settlement records |
| `GET` | `/api/analytics` | Enterprise KPI metrics & chart data |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
