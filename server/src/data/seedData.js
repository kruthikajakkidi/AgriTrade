export const initialUsers = [
  {
    id: 'usr_farmer_ravi',
    name: 'Ravi Kumar',
    email: 'ravi.farmer@agritrade.org',
    phone: '+91 98480 12345',
    role: 'FARMER',
    location: 'Siddipet, Telangana',
    farmName: 'Ravi Organic Green Farms (12 Acres)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.9,
    joinedDate: '2023-04-15'
  },
  {
    id: 'usr_buyer_priya',
    name: 'Priya Sharma',
    email: 'priya.procurement@grainmillers.com',
    phone: '+91 98200 54321',
    role: 'BUYER',
    organization: 'Grain Millers & Exporters Ltd',
    location: 'Hyderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    verified: true,
    procurementVolume: '450 Tons/Year',
    joinedDate: '2022-11-20'
  },
  {
    id: 'usr_mgr_ramesh',
    name: 'Ramesh Varma',
    email: 'ramesh.hub@agritrade.org',
    phone: '+91 99887 76655',
    role: 'COLLECTION_CENTER',
    centerName: 'Warangal Agri-Logistics Hub #4',
    location: 'Warangal, Telangana',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    capacity: '100 Tons',
    joinedDate: '2021-08-10'
  },
  {
    id: 'usr_insp_suresh',
    name: 'Dr. Suresh Patel',
    email: 'suresh.patel@agriquality.gov.in',
    phone: '+91 97112 33445',
    role: 'QUALITY_INSPECTOR',
    certificationNumber: 'AGMARK-QI-2024-88',
    location: 'Regional Testing Lab, Warangal',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    inspectionsCompleted: 1420,
    joinedDate: '2020-03-01'
  },
  {
    id: 'usr_log_balu',
    name: 'Balu Nayak',
    email: 'balu.fleet@kisanlogistics.com',
    phone: '+91 94401 99887',
    role: 'LOGISTICS',
    agency: 'Kisan Express Cargo & Reefer Fleet',
    location: 'Secunderabad Logistics Yard',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    fleetSize: 18,
    joinedDate: '2022-01-14'
  },
  {
    id: 'usr_admin_anita',
    name: 'Anita Roy',
    email: 'anita.admin@agritrade.org',
    phone: '+91 99001 11223',
    role: 'ADMIN',
    department: 'Platform Governance & Settlement Operations',
    location: 'National HQ, New Delhi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2020-01-01'
  }
];

export const CROP_IMAGES = {
  Rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
  Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
  Cotton: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
  Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
  Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
  Maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
  Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
  Chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
  Pulses: 'https://images.unsplash.com/photo-1585994192701-f1a505c8574a?w=800&auto=format&fit=crop&q=80',
  Mustard: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80',
  Soybean: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
};

export const initialLots = [
  {
    id: 'LOT-2026-00125',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    farmerPhone: '+91 98480 12345',
    cropName: 'Rice',
    variety: 'Sona Masoori (Organic)',
    category: 'Cereals & Grains',
    quantity: 1200,
    unit: 'kg',
    expectedPrice: 42,
    basePrice: 40,
    harvestDate: '2026-08-25',
    farmLocation: 'Siddipet District, Telangana',
    collectionCenter: 'Warangal Agri-Logistics Hub #4',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'ACCEPTED', // CREATED -> RECEIVED -> INSPECTION_PENDING -> INSPECTED -> ACCEPTED
    warehouseSection: 'A1',
    qualityGrade: 'Grade A',
    qualityScore: 94,
    moisturePercent: 12.4,
    defectPercent: 1.8,
    foreignMaterialPercent: 0.5,
    assignedBuyerId: 'usr_buyer_priya',
    assignedPoId: 'PO-2024-00204',
    qrCodeData: 'https://agritrade.org/trace/LOT-2026-00125',
    timeline: [
      {
        stage: 'CREATED',
        label: 'Produce Lot Created',
        date: '2026-08-28',
        time: '09:15 AM',
        location: 'Siddipet Farm',
        actor: 'Ravi Kumar (Farmer)',
        notes: 'Submitted 1,200 kg Sona Masoori Rice directly from field'
      },
      {
        stage: 'RECEIVED',
        label: 'Received at Hub',
        date: '2026-08-29',
        time: '11:30 AM',
        location: 'Warangal Hub #4 Weighbridge',
        actor: 'Ramesh Varma (Hub Manager)',
        notes: 'Gross weighment verified: 1,208 kg gross, 1,200 kg net'
      },
      {
        stage: 'INSPECTED',
        label: 'Quality Inspected',
        date: '2026-08-30',
        time: '02:15 PM',
        location: 'Testing Lab #2',
        actor: 'Dr. Suresh Patel (Quality Inspector)',
        notes: 'Moisture: 12.4%, Grain integrity: High, AI Match: Grade A (94%)'
      },
      {
        stage: 'ACCEPTED',
        label: 'Accepted for Procurement',
        date: '2026-08-30',
        time: '03:00 PM',
        location: 'Warangal Central Warehouse',
        actor: 'Dr. Suresh Patel (Quality Inspector)',
        notes: 'Official AGMARK certificate issued. Transferred to Section A1'
      }
    ],
    createdAt: '2026-08-28T09:15:00Z'
  },
  {
    id: 'LOT-2026-00126',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    farmerPhone: '+91 98480 12345',
    cropName: 'Wheat',
    variety: 'Sharbati Gold',
    category: 'Cereals & Grains',
    quantity: 3500,
    unit: 'kg',
    expectedPrice: 34,
    basePrice: 33,
    harvestDate: '2026-08-20',
    farmLocation: 'Siddipet District, Telangana',
    collectionCenter: 'Warangal Agri-Logistics Hub #4',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'STORED',
    warehouseSection: 'A2',
    qualityGrade: 'Grade A',
    qualityScore: 92,
    moisturePercent: 11.8,
    defectPercent: 2.1,
    foreignMaterialPercent: 0.8,
    qrCodeData: 'https://agritrade.org/trace/LOT-2026-00126',
    timeline: [
      {
        stage: 'CREATED',
        label: 'Produce Lot Created',
        date: '2026-08-22',
        time: '08:00 AM',
        location: 'Siddipet Farm',
        actor: 'Ravi Kumar (Farmer)',
        notes: 'Harvested directly, dry bagged'
      },
      {
        stage: 'RECEIVED',
        label: 'Received at Hub',
        date: '2026-08-23',
        time: '10:00 AM',
        location: 'Warangal Hub',
        actor: 'Ramesh Varma',
        notes: 'Unloaded and barcoded'
      },
      {
        stage: 'ACCEPTED',
        label: 'Graded & Approved',
        date: '2026-08-24',
        time: '01:30 PM',
        location: 'Testing Lab',
        actor: 'Dr. Suresh Patel',
        notes: 'Grade A Sharbati Wheat'
      },
      {
        stage: 'STORED',
        label: 'Stored in Warehouse',
        date: '2026-08-24',
        time: '04:00 PM',
        location: 'Bay A2, Warangal Hub',
        actor: 'Ramesh Varma',
        notes: 'Moisture controlled bay'
      }
    ],
    createdAt: '2026-08-22T08:00:00Z'
  },
  {
    id: 'LOT-2026-00127',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    farmerPhone: '+91 98480 12345',
    cropName: 'Cotton',
    variety: 'Bt Cotton Long Staple',
    category: 'Commercial Crops',
    quantity: 2000,
    unit: 'kg',
    expectedPrice: 72,
    basePrice: 70,
    harvestDate: '2026-08-29',
    farmLocation: 'Siddipet District, Telangana',
    collectionCenter: 'Warangal Agri-Logistics Hub #4',
    images: [
      'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'INSPECTION_PENDING',
    warehouseSection: 'Receiving Dock',
    qualityGrade: 'Pending',
    qualityScore: null,
    qrCodeData: 'https://agritrade.org/trace/LOT-2026-00127',
    timeline: [
      {
        stage: 'CREATED',
        label: 'Produce Lot Created',
        date: '2026-08-30',
        time: '07:30 AM',
        location: 'Siddipet Farm',
        actor: 'Ravi Kumar (Farmer)',
        notes: 'Baled and tagged'
      },
      {
        stage: 'RECEIVED',
        label: 'Received at Hub',
        date: '2026-08-31',
        time: '09:00 AM',
        location: 'Warangal Receiving Bay',
        actor: 'Ramesh Varma',
        notes: 'Weighed 2,000 kg, waiting on lab inspection'
      },
      {
        stage: 'INSPECTION_PENDING',
        label: 'Queued for Quality Check',
        date: '2026-08-31',
        time: '10:15 AM',
        location: 'Inspection Bay B',
        actor: 'System Queue',
        notes: 'Assigned to Dr. Suresh Patel'
      }
    ],
    createdAt: '2026-08-30T07:30:00Z'
  },
  {
    id: 'LOT-2026-00128',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    farmerPhone: '+91 98480 12345',
    cropName: 'Tomato',
    variety: 'Roma Hybrid',
    category: 'Vegetables',
    quantity: 800,
    unit: 'kg',
    expectedPrice: 28,
    basePrice: 26,
    harvestDate: '2026-09-01',
    farmLocation: 'Siddipet Greenhouses',
    collectionCenter: 'Warangal Agri-Logistics Hub #4',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'DISPATCHED',
    warehouseSection: 'Bay C1 (Cold Storage)',
    qualityGrade: 'Grade A',
    qualityScore: 96,
    assignedBuyerId: 'usr_buyer_priya',
    assignedPoId: 'PO-2024-00204',
    shipmentId: 'SHP-1024',
    qrCodeData: 'https://agritrade.org/trace/LOT-2026-00128',
    timeline: [
      {
        stage: 'CREATED',
        label: 'Harvested & Logged',
        date: '2026-09-01',
        time: '06:00 AM',
        location: 'Greenhouse #3',
        actor: 'Ravi Kumar',
        notes: 'Handpicked fresh vine tomatoes'
      },
      {
        stage: 'ACCEPTED',
        label: 'Speed Inspection Passed',
        date: '2026-09-01',
        time: '11:00 AM',
        location: 'Warangal Hub',
        actor: 'Dr. Suresh Patel',
        notes: 'High firmness, Grade A certified'
      },
      {
        stage: 'DISPATCHED',
        label: 'Loaded on Reefer Truck',
        date: '2026-09-02',
        time: '08:30 AM',
        location: 'Dock 4, Warangal',
        actor: 'Balu Nayak (Logistics)',
        notes: 'En route to Vijayawada distribution depot'
      }
    ],
    createdAt: '2026-09-01T06:00:00Z'
  },
  {
    id: 'LOT-2026-00129',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    farmerPhone: '+91 98480 12345',
    cropName: 'Maize',
    variety: 'Yellow Feed Corn',
    category: 'Cereals & Grains',
    quantity: 5000,
    unit: 'kg',
    expectedPrice: 24,
    basePrice: 24,
    harvestDate: '2026-07-15',
    farmLocation: 'Siddipet Farm',
    collectionCenter: 'Warangal Agri-Logistics Hub #4',
    images: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'DELIVERED',
    qualityGrade: 'Grade B',
    qualityScore: 84,
    assignedBuyerId: 'usr_buyer_priya',
    assignedPoId: 'PO-2024-00205',
    qrCodeData: 'https://agritrade.org/trace/LOT-2026-00129',
    timeline: [
      {
        stage: 'DELIVERED',
        label: 'Successfully Delivered to Buyer',
        date: '2026-08-10',
        time: '04:45 PM',
        location: 'Grain Millers Depot, Hyderabad',
        actor: 'Priya Sharma (Buyer Acceptance)',
        notes: 'Full quantity verified & settled'
      }
    ],
    createdAt: '2026-07-15T08:00:00Z'
  },
  {
    id: 'LOT-2026-00130',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    farmerPhone: '+91 98480 12345',
    cropName: 'Onion',
    variety: 'Nashik Red',
    category: 'Vegetables',
    quantity: 1500,
    unit: 'kg',
    expectedPrice: 36,
    basePrice: 35,
    harvestDate: '2026-09-02',
    farmLocation: 'Siddipet Farm',
    collectionCenter: 'Warangal Agri-Logistics Hub #4',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'CREATED',
    qualityGrade: 'Pending',
    qualityScore: null,
    qrCodeData: 'https://agritrade.org/trace/LOT-2026-00130',
    timeline: [
      {
        stage: 'CREATED',
        label: 'Produce Lot Registered',
        date: '2026-09-02',
        time: '08:00 AM',
        location: 'Siddipet Farm',
        actor: 'Ravi Kumar',
        notes: 'Cured and packed in breathable jute sacks'
      }
    ],
    createdAt: '2026-09-02T08:00:00Z'
  }
];

export const initialOrders = [
  {
    id: 'PO-2024-00204',
    buyerId: 'usr_buyer_priya',
    buyerName: 'Priya Sharma',
    buyerCompany: 'Grain Millers & Exporters Ltd',
    produce: 'Rice (Sona Masoori)',
    gradeRequested: 'Grade A',
    quantity: 5000,
    unit: 'kg',
    targetPrice: 42,
    totalAmount: 210000,
    status: 'CONFIRMED', // DRAFT -> SUBMITTED -> CONFIRMED -> PARTIALLY_FULFILLED -> FULFILLED -> DELIVERED
    allocatedLotIds: ['LOT-2026-00125', 'LOT-2026-00128'],
    deliveryAddress: 'Plot 44, Food Processing Zone, Hyderabad, 500081',
    deliveryDate: '2026-09-12',
    paymentStatus: 'ESCROW_FUNDED',
    notes: 'Export standard packaging required with moisture < 13%',
    createdAt: '2026-08-27T10:00:00Z'
  },
  {
    id: 'PO-2024-00205',
    buyerId: 'usr_buyer_priya',
    buyerName: 'Priya Sharma',
    buyerCompany: 'Grain Millers & Exporters Ltd',
    produce: 'Wheat (Sharbati)',
    gradeRequested: 'Grade A',
    quantity: 3500,
    unit: 'kg',
    targetPrice: 34,
    totalAmount: 119000,
    status: 'DELIVERED',
    allocatedLotIds: ['LOT-2026-00126'],
    deliveryAddress: 'Flour Mill Unit 2, Secunderabad, 500003',
    deliveryDate: '2026-08-28',
    paymentStatus: 'SETTLED',
    notes: 'Received in full condition. Payment released.',
    createdAt: '2026-08-15T09:30:00Z'
  }
];

export const initialWarehouse = {
  centerId: 'usr_mgr_ramesh',
  centerName: 'Warangal Agri-Logistics Hub #4',
  location: 'NH 163, Industrial Corridor, Warangal',
  totalCapacityTons: 100,
  occupiedTons: 67, // exactly 67 / 100 Tons (67%) from prompt
  sections: [
    { id: 'A1', name: 'Bay A1', produce: 'Organic Rice (LOT-125)', lotId: 'LOT-2026-00125', quantityTons: 1.2, grade: 'Grade A', status: 'Allocated for PO-204', temp: '22°C', humidity: '55%' },
    { id: 'A2', name: 'Bay A2', produce: 'Sharbati Wheat (LOT-126)', lotId: 'LOT-2026-00126', quantityTons: 3.5, grade: 'Grade A', status: 'Stored', temp: '21°C', humidity: '50%' },
    { id: 'A3', name: 'Bay A3', produce: 'Hybrid Feed Maize', lotId: 'LOT-PREV-091', quantityTons: 15.0, grade: 'Grade B', status: 'Stored', temp: '23°C', humidity: '58%' },
    { id: 'B1', name: 'Bay B1', produce: 'Red Gram / Toor Dal', lotId: 'LOT-PREV-094', quantityTons: 22.0, grade: 'Grade A', status: 'Ready for Dispatch', temp: '20°C', humidity: '48%' },
    { id: 'B2', name: 'Bay B2', produce: 'Bt Cotton Bales', lotId: 'LOT-PREV-098', quantityTons: 25.3, grade: 'Grade B', status: 'Stored', temp: '24°C', humidity: '45%' },
    { id: 'B3', name: 'Bay B3', produce: 'Available Buffer Bay', lotId: null, quantityTons: 0, grade: 'Open', status: 'Empty (33 Tons remaining)', temp: '22°C', humidity: '50%' }
  ],
  movementHistory: [
    { id: 'MOV-101', date: '2026-09-02 08:30 AM', lotId: 'LOT-2026-00128', from: 'Bay C1', to: 'Truck TS09AB1234', quantity: '800 kg', actor: 'Balu Nayak (Logistics)', action: 'STOCK_OUT' },
    { id: 'MOV-102', date: '2026-08-30 03:15 PM', lotId: 'LOT-2026-00125', from: 'Receiving Dock', to: 'Bay A1', quantity: '1,200 kg', actor: 'Ramesh Varma', action: 'STOCK_IN' },
    { id: 'MOV-103', date: '2026-08-24 04:10 PM', lotId: 'LOT-2026-00126', from: 'Testing Bay', to: 'Bay A2', quantity: '3,500 kg', actor: 'Ramesh Varma', action: 'MOVE' }
  ]
};

export const initialShipments = [
  {
    id: 'SHP-1024',
    lotIds: ['LOT-2026-00125', 'LOT-2026-00128'],
    poId: 'PO-2024-00204',
    cropDescription: 'Rice (1,200 kg) & Tomatoes (800 kg)',
    totalWeightKg: 2000,
    origin: 'Warangal Collection Hub',
    destination: 'Hyderabad Food Processing Zone',
    routeLabel: 'Warangal → Suryapet → Hyderabad',
    vehicleNumber: 'TS09AB1234',
    vehicleType: 'Reefer 16-FT Eicher Pro',
    driverName: 'Ramesh Yadav',
    driverPhone: '+91 98499 77112',
    status: 'IN_TRANSIT', // SCHEDULED -> DISPATCHED -> IN_TRANSIT -> DELIVERED
    dispatchTime: '2026-09-02 08:30 AM',
    expectedDelivery: '2026-09-02 04:30 PM',
    actualDelivery: null,
    currentLocation: 'NH 65 near Suryapet (Speed: 52 km/h, Reefer Temp: 4.2°C)',
    progressPercent: 62,
    routeWaypoints: [
      { name: 'Warangal Hub', passed: true, time: '08:30 AM', status: 'Dispatched from Bay 4' },
      { name: 'Jangaon Toll', passed: true, time: '10:15 AM', status: 'Weight checked: OK' },
      { name: 'Suryapet Bypass', passed: true, time: '12:45 PM', status: 'Driver 15m rest break' },
      { name: 'Choutuppal Outer', passed: false, eta: '02:40 PM', status: 'Next waypoint' },
      { name: 'Hyderabad Depot', passed: false, eta: '04:30 PM', status: 'Final Destination' }
    ]
  },
  {
    id: 'SHP-1025',
    lotIds: ['LOT-2026-00126'],
    poId: 'PO-2024-00205',
    cropDescription: 'Sharbati Wheat (3,500 kg)',
    totalWeightKg: 3500,
    origin: 'Warangal Hub',
    destination: 'Secunderabad Flour Mills',
    routeLabel: 'Warangal → Secunderabad',
    vehicleNumber: 'AP16XY9876',
    vehicleType: 'Heavy 10-T Tata Cargo',
    driverName: 'Venkat Rao',
    driverPhone: '+91 97000 88221',
    status: 'DELIVERED',
    dispatchTime: '2026-08-28 07:00 AM',
    expectedDelivery: '2026-08-28 02:00 PM',
    actualDelivery: '2026-08-28 01:45 PM',
    currentLocation: 'Secunderabad Mill Unloading Complete',
    progressPercent: 100,
    routeWaypoints: [
      { name: 'Warangal Hub', passed: true, time: '07:00 AM', status: 'Loaded & sealed' },
      { name: 'Aler Toll Gate', passed: true, time: '09:30 AM', status: 'Toll transit' },
      { name: 'Secunderabad Depot', passed: true, time: '01:45 PM', status: 'Delivered & signed by Priya S.' }
    ]
  }
];

export const initialSettlements = [
  {
    id: 'SET-8801',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    lotId: 'LOT-2026-00125',
    cropName: 'Rice (Sona Masoori)',
    acceptedQuantityKg: 950,
    basePrice: 40,
    grossAmount: 38000,
    qualityBonus: 1500,
    transportDeduction: -800,
    otherAdjustments: 0,
    finalAmount: 38700, // 38000 + 1500 - 800 = 38,700 as exact prompt example
    status: 'PROCESSED',
    paymentReference: 'UPI-RBI-9042918820',
    paidAt: '2026-08-31 11:20 AM',
    bankAccount: 'State Bank of India •••• 4092'
  },
  {
    id: 'SET-8802',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    lotId: 'LOT-2026-00126',
    cropName: 'Wheat (Sharbati)',
    acceptedQuantityKg: 3500,
    basePrice: 33,
    grossAmount: 115500,
    qualityBonus: 3500,
    transportDeduction: -1500,
    otherAdjustments: 0,
    finalAmount: 117500,
    status: 'PROCESSED',
    paymentReference: 'NEFT-HDFC-88192031',
    paidAt: '2026-08-26 03:40 PM',
    bankAccount: 'State Bank of India •••• 4092'
  },
  {
    id: 'SET-8803',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    lotId: 'LOT-2026-00128',
    cropName: 'Tomato (Roma)',
    acceptedQuantityKg: 800,
    basePrice: 26,
    grossAmount: 20800,
    qualityBonus: 1200,
    transportDeduction: -600,
    otherAdjustments: 0,
    finalAmount: 21400,
    status: 'PENDING_APPROVAL',
    paymentReference: 'Pending Admin Authorization',
    paidAt: null,
    bankAccount: 'State Bank of India •••• 4092'
  }
];

export const initialDisputes = [
  {
    id: 'DSP-401',
    farmerId: 'usr_farmer_ravi',
    farmerName: 'Ravi Kumar',
    lotId: 'LOT-2026-00127',
    category: 'Wrong quality grade',
    title: 'Dispute on Moisture and Grade B classification for Bt Cotton',
    description: 'Cotton was harvested in dry condition with moisture below 8% at field test. Due to rain delay at unloading bay, humidity increased. Request secondary lab re-testing with Dr. Suresh Patel.',
    evidenceImages: [
      'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'UNDER_REVIEW', // RAISED -> UNDER_REVIEW -> INVESTIGATION -> RESOLVED
    timeline: [
      { status: 'RAISED', date: '2026-09-01 02:30 PM', note: 'Dispute submitted by farmer with photographic proof' },
      { status: 'UNDER_REVIEW', date: '2026-09-02 09:15 AM', note: 'Assigned to Senior Grievance Officer Anita Roy' }
    ],
    resolutionNotes: null,
    createdAt: '2026-09-01T02:30:00Z'
  }
];

export const initialAuditLogs = [
  {
    id: 'AUD-901',
    userName: 'Dr. Suresh Patel',
    userRole: 'Quality Inspector',
    action: 'INSPECT_AND_ACCEPT',
    entityType: 'ProduceLot',
    entityId: 'LOT-2026-00125',
    previousStatus: 'INSPECTED',
    newStatus: 'ACCEPTED',
    timestamp: '2026-08-30 03:00 PM',
    details: 'Graded A (94/100) after moisture test (12.4%) and purity verification.'
  },
  {
    id: 'AUD-902',
    userName: 'Ramesh Varma',
    userRole: 'Collection Center Manager',
    action: 'RECEIVE_WEIGH',
    entityType: 'ProduceLot',
    entityId: 'LOT-2026-00125',
    previousStatus: 'CREATED',
    newStatus: 'RECEIVED',
    timestamp: '2026-08-29 11:30 AM',
    details: 'Weighed on certified electronic weighbridge #1. Net wt: 1,200 kg.'
  },
  {
    id: 'AUD-903',
    userName: 'Balu Nayak',
    userRole: 'Logistics Coordinator',
    action: 'DISPATCH_SHIPMENT',
    entityType: 'Shipment',
    entityId: 'SHP-1024',
    previousStatus: 'ALLOCATED',
    newStatus: 'DISPATCHED',
    timestamp: '2026-09-02 08:30 AM',
    details: 'Dispatched via TS09AB1234 to Hyderabad. Reefer active at 4°C.'
  },
  {
    id: 'AUD-904',
    userName: 'Anita Roy',
    userRole: 'Platform Admin',
    action: 'SETTLEMENT_PROCESSED',
    entityType: 'Settlement',
    entityId: 'SET-8801',
    previousStatus: 'PENDING_APPROVAL',
    newStatus: 'PROCESSED',
    timestamp: '2026-08-31 11:20 AM',
    details: 'Settlement of ₹38,700 processed to Ravi Kumar via UPI.'
  }
];

export const initialNotifications = [
  {
    id: 'NOTIF-1',
    userId: 'usr_farmer_ravi',
    role: 'FARMER',
    title: 'Produce Lot Accepted',
    message: 'Your Rice lot LOT-2026-00125 has been accepted with Grade A certification!',
    type: 'success',
    isRead: false,
    timestamp: '10 minutes ago'
  },
  {
    id: 'NOTIF-2',
    userId: 'usr_buyer_priya',
    role: 'BUYER',
    title: 'PO Confirmed',
    message: 'PO-2024-00204 has been confirmed by supplier and allocated lots.',
    type: 'info',
    isRead: false,
    timestamp: '1 hour ago'
  },
  {
    id: 'NOTIF-3',
    userId: 'usr_log_balu',
    role: 'LOGISTICS',
    title: 'Shipment Dispatched',
    message: 'Shipment SHP-1024 has been dispatched towards Hyderabad.',
    type: 'info',
    isRead: true,
    timestamp: '3 hours ago'
  },
  {
    id: 'NOTIF-4',
    userId: 'usr_farmer_ravi',
    role: 'FARMER',
    title: 'Payment Processed',
    message: 'Settlement of ₹38,700 has been processed to your bank account.',
    type: 'success',
    isRead: false,
    timestamp: 'Yesterday'
  }
];
