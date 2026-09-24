import express from 'express';
import { db } from '../config/db.js';
import { validateStateTransition, getTimelineStageDetails } from '../services/stateMachine.js';
import { predictQuality } from '../services/aiQualityService.js';
import { predictCropPrice, getHistoricalPriceTrends, MSP_BENCHMARKS } from '../services/cropPriceMlService.js';
import { CROP_IMAGES } from '../data/seedData.js';

const router = express.Router();

// Helper to record audit log
const recordAudit = (userName, userRole, action, entityType, entityId, previousStatus, newStatus, details) => {
  const auditEntry = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    userName: userName || 'System User',
    userRole: userRole || 'System',
    action,
    entityType,
    entityId,
    previousStatus: previousStatus || 'N/A',
    newStatus: newStatus || 'N/A',
    timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    details
  };
  db.create('auditLogs', auditEntry);
  return auditEntry;
};

// Helper to create notification
const pushNotification = (userId, role, title, message, type = 'info') => {
  const notif = {
    id: `NOTIF-${Date.now()}`,
    userId,
    role,
    title,
    message,
    type,
    isRead: false,
    timestamp: 'Just now'
  };
  db.create('notifications', notif);
  return notif;
};

// ==========================================
// 1. HEALTH & RESET
// ==========================================
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'AgriTrade Core API',
    version: '1.0.0',
    mode: 'Dual-Engine Resilient DataStore',
    timestamp: new Date().toISOString()
  });
});

router.post('/reset', (req, res) => {
  db.reset();
  res.json({ success: true, message: 'Platform demo data successfully reseeded.' });
});

// ==========================================
// 2. AUTHENTICATION & DEMO PROFILES
// ==========================================
router.post('/auth/login', (req, res) => {
  const { identifier, role } = req.body;
  const users = db.get('users');

  // If role is provided or identifier matches email/phone
  let user = null;
  if (role) {
    user = users.find(u => u.role === role);
  }
  if (!user && identifier) {
    user = users.find(u => u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier);
  }

  // Fallback to first farmer if not found
  if (!user) {
    user = users.find(u => u.role === 'FARMER') || users[0];
  }

  res.json({
    success: true,
    user,
    token: `agri_token_${user.id}_${Date.now()}`
  });
});

router.post('/auth/register', (req, res) => {
  const { name, email, phone, role, location, organization, farmName } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and Role are required.' });
  }

  const newUser = {
    id: `usr_${role.toLowerCase()}_${Date.now().toString().slice(-4)}`,
    name,
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@agritrade.org`,
    phone: phone || '+91 99999 00000',
    role: role.toUpperCase(),
    location: location || 'Telangana, India',
    organization: organization || (role === 'BUYER' ? 'Agri Agro Procurements' : undefined),
    farmName: farmName || (role === 'FARMER' ? `${name}'s Farm` : undefined),
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    verified: true,
    joinedDate: new Date().toISOString().split('T')[0]
  };

  db.create('users', newUser);
  recordAudit(name, role, 'REGISTER_USER', 'User', newUser.id, 'NEW', 'ACTIVE', `User registered with role ${role}`);

  res.status(201).json({
    success: true,
    user: newUser,
    token: `agri_token_${newUser.id}_${Date.now()}`
  });
});

router.get('/users', (req, res) => {
  const { role } = req.query;
  const users = db.get('users');
  if (role) {
    return res.json(users.filter(u => u.role === role.toUpperCase()));
  }
  res.json(users);
});

// ==========================================
// 3. PRODUCE LOTS & SUPPLY CHAIN ENGINE
// ==========================================
router.get('/lots', (req, res) => {
  const { crop, grade, status, farmerId, search } = req.query;
  let lots = db.get('lots');

  if (crop) lots = lots.filter(l => l.cropName.toLowerCase().includes(crop.toLowerCase()));
  if (grade) lots = lots.filter(l => l.qualityGrade === grade);
  if (status) lots = lots.filter(l => l.status === status);
  if (farmerId) lots = lots.filter(l => l.farmerId === farmerId);
  if (search) {
    const s = search.toLowerCase();
    lots = lots.filter(l =>
      l.cropName.toLowerCase().includes(s) ||
      l.id.toLowerCase().includes(s) ||
      l.farmLocation.toLowerCase().includes(s) ||
      l.farmerName.toLowerCase().includes(s)
    );
  }

  res.json(lots);
});

router.get('/lots/:id', (req, res) => {
  const lot = db.findById('lots', req.params.id);
  if (!lot) return res.status(404).json({ error: 'Produce lot not found' });
  res.json(lot);
});

// Farmer "Sell My Produce" 5-step wizard submission
router.post('/lots', (req, res) => {
  const {
    farmerId,
    farmerName,
    farmerPhone,
    cropName,
    variety,
    category,
    quantity,
    unit,
    expectedPrice,
    harvestDate,
    farmLocation,
    collectionCenter,
    images
  } = req.body;

  if (!cropName || !quantity) {
    return res.status(400).json({ error: 'Crop name and quantity are required.' });
  }

  const lotNumber = Math.floor(10000 + Math.random() * 90000);
  const newLotId = `LOT-2026-${lotNumber}`;

  const initialTimeline = [
    {
      stage: 'CREATED',
      label: 'Produce Lot Created',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location: farmLocation || 'Farmer Field',
      actor: farmerName || 'Ravi Kumar (Farmer)',
      notes: `Registered ${quantity} ${unit || 'kg'} of ${cropName} (${variety || 'Standard'})`
    }
  ];

  const defaultCropImages = {
    Rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    Cotton: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
    Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    Maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80'
  };

  const lotImages = (images && images.length) ? images : [defaultCropImages[cropName] || defaultCropImages.Rice];

  const newLot = {
    id: newLotId,
    farmerId: farmerId || 'usr_farmer_ravi',
    farmerName: farmerName || 'Ravi Kumar',
    farmerPhone: farmerPhone || '+91 98480 12345',
    cropName,
    variety: variety || 'Standard High-Yield',
    category: category || 'Grains & Pulses',
    quantity: parseFloat(quantity),
    unit: unit || 'kg',
    expectedPrice: parseFloat(expectedPrice) || 40,
    basePrice: parseFloat(expectedPrice) || 40,
    harvestDate: harvestDate || new Date().toISOString().split('T')[0],
    farmLocation: farmLocation || 'Siddipet District, Telangana',
    collectionCenter: collectionCenter || 'Warangal Agri-Logistics Hub #4',
    images: lotImages,
    status: 'CREATED',
    qualityGrade: 'Pending',
    qualityScore: null,
    warehouseSection: 'In Transit to Hub',
    qrCodeData: `https://agritrade.org/trace/${newLotId}`,
    timeline: initialTimeline,
    createdAt: new Date().toISOString()
  };

  db.create('lots', newLot);

  // Record audit
  recordAudit(farmerName, 'Farmer', 'CREATE_PRODUCE_LOT', 'ProduceLot', newLotId, 'NONE', 'CREATED', `Submitted ${quantity}kg ${cropName}`);

  // Push notification to collection center
  pushNotification(
    'usr_mgr_ramesh',
    'COLLECTION_CENTER',
    'New Incoming Produce Lot',
    `Farmer ${farmerName || 'Ravi Kumar'} submitted ${quantity}kg ${cropName} (${newLotId}) for intake.`,
    'info'
  );

  res.status(201).json({
    success: true,
    lot: newLot,
    message: 'Produce lot submitted successfully! Lot ID: ' + newLotId
  });
});

// State Transition Route (Strict State Machine validation)
router.patch('/lots/:id/status', (req, res) => {
  const { id } = req.params;
  const { targetStatus, actorName, actorRole, location, notes, warehouseSection } = req.body;

  const lot = db.findById('lots', id);
  if (!lot) return res.status(404).json({ error: 'Produce lot not found' });

  const check = validateStateTransition(lot.status, targetStatus);
  if (!check.valid) {
    return res.status(400).json({ error: check.error, currentStatus: lot.status, targetStatus });
  }

  const previousStatus = lot.status;
  const stageDetails = getTimelineStageDetails(targetStatus);

  const timelineEntry = {
    stage: targetStatus,
    label: stageDetails.label,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    location: location || lot.collectionCenter || 'AgriTrade Hub',
    actor: actorName || 'Operations Officer',
    notes: notes || `Status advanced from ${previousStatus} to ${targetStatus}`
  };

  const updates = {
    status: targetStatus,
    timeline: [...lot.timeline, timelineEntry]
  };

  if (warehouseSection) {
    updates.warehouseSection = warehouseSection;
  }

  const updatedLot = db.update('lots', id, updates);

  // Record Audit
  recordAudit(actorName, actorRole, `ADVANCE_STATE_${targetStatus}`, 'ProduceLot', id, previousStatus, targetStatus, notes || 'Lifecycle state progression');

  // Notify farmer
  pushNotification(
    lot.farmerId,
    'FARMER',
    `Produce Lot ${targetStatus}`,
    `Your lot ${lot.id} (${lot.cropName}) is now marked as ${targetStatus.replace(/_/g, ' ')}.`,
    targetStatus === 'ACCEPTED' ? 'success' : 'info'
  );

  res.json({
    success: true,
    lot: updatedLot,
    message: `Lot status updated to ${targetStatus}`
  });
});

// ==========================================
// 4. AI QUALITY PREDICTION & INSPECTION
// ==========================================
router.post('/lots/:id/predict-quality', (req, res) => {
  const lot = db.findById('lots', req.params.id);
  if (!lot) return res.status(404).json({ error: 'Lot not found' });

  const { moisturePercent, defectPercent, foreignMaterialPercent } = req.body;

  const prediction = predictQuality({
    cropName: lot.cropName,
    moisturePercent: moisturePercent || lot.moisturePercent || 12.4,
    defectPercent: defectPercent || lot.defectPercent || 1.8,
    foreignMaterialPercent: foreignMaterialPercent || lot.foreignMaterialPercent || 0.5,
    weightKg: lot.quantity
  });

  res.json({
    lotId: lot.id,
    cropName: lot.cropName,
    prediction
  });
});

router.post('/lots/:id/inspect', (req, res) => {
  const { id } = req.params;
  const {
    inspectorName,
    inspectorId,
    moisturePercent,
    defectPercent,
    foreignMaterialPercent,
    color,
    size,
    qualityScore,
    grade,
    decision, // ACCEPT or REJECT
    remarks,
    overrideAi
  } = req.body;

  const lot = db.findById('lots', id);
  if (!lot) return res.status(404).json({ error: 'Lot not found' });

  const targetStatus = decision === 'REJECT' ? 'REJECTED' : 'ACCEPTED';
  const check = validateStateTransition(lot.status, targetStatus);
  if (!check.valid && lot.status !== 'INSPECTION_PENDING' && lot.status !== 'RECEIVED') {
    return res.status(400).json({ error: check.error });
  }

  const previousStatus = lot.status;

  const timelineEntry = {
    stage: targetStatus,
    label: targetStatus === 'ACCEPTED' ? 'Graded & Quality Accepted' : 'Quality Rejected',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    location: 'Quality Testing Lab #2',
    actor: inspectorName || 'Dr. Suresh Patel (Certified Inspector)',
    notes: `${grade || 'Grade A'} (Score: ${qualityScore || 94}/100). Moisture: ${moisturePercent}%, Defects: ${defectPercent}%. ${remarks || ''}`
  };

  const updates = {
    status: targetStatus,
    qualityGrade: grade || 'Grade A',
    qualityScore: parseInt(qualityScore) || 94,
    moisturePercent: parseFloat(moisturePercent) || 12.0,
    defectPercent: parseFloat(defectPercent) || 1.8,
    foreignMaterialPercent: parseFloat(foreignMaterialPercent) || 0.5,
    timeline: [...lot.timeline, timelineEntry]
  };

  // If accepted, auto-generate settlement calculation draft
  if (targetStatus === 'ACCEPTED') {
    const acceptedKg = lot.quantity;
    const basePrice = lot.expectedPrice || 40;
    const grossAmount = acceptedKg * basePrice;
    const qualityBonus = grade === 'Grade A' ? 1500 : (grade === 'Grade B' ? 500 : 0);
    const transportDeduction = -800;
    const finalAmount = grossAmount + qualityBonus + transportDeduction;

    const settlementId = `SET-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSettlement = {
      id: settlementId,
      farmerId: lot.farmerId,
      farmerName: lot.farmerName,
      lotId: lot.id,
      cropName: `${lot.cropName} (${lot.variety || ''})`,
      acceptedQuantityKg: acceptedKg,
      basePrice,
      grossAmount,
      qualityBonus,
      transportDeduction,
      otherAdjustments: 0,
      finalAmount,
      status: 'PENDING_APPROVAL',
      paidAt: null,
      bankAccount: 'State Bank of India •••• 4092'
    };
    db.create('settlements', newSettlement);
  }

  const updatedLot = db.update('lots', id, updates);

  recordAudit(
    inspectorName || 'Dr. Suresh Patel',
    'Quality Inspector',
    'INSPECT_PRODUCE',
    'ProduceLot',
    id,
    previousStatus,
    targetStatus,
    `Inspected as ${grade} with score ${qualityScore}. AI override: ${overrideAi ? 'YES' : 'NO'}`
  );

  pushNotification(
    lot.farmerId,
    'FARMER',
    `Inspection Completed: ${targetStatus}`,
    `Your ${lot.cropName} lot ${lot.id} has been awarded ${grade} (Score ${qualityScore}/100). Status: ${targetStatus}.`,
    targetStatus === 'ACCEPTED' ? 'success' : 'error'
  );

  res.json({
    success: true,
    lot: updatedLot,
    message: `Inspection recorded. Lot is now ${targetStatus}.`
  });
});

// ==========================================
// 5. BUYER & PURCHASE ORDERS
// ==========================================
router.get('/orders', (req, res) => {
  const { buyerId, status } = req.query;
  let orders = db.get('orders');
  if (buyerId) orders = orders.filter(o => o.buyerId === buyerId);
  if (status) orders = orders.filter(o => o.status === status);
  res.json(orders);
});

router.post('/orders', (req, res) => {
  const {
    buyerId,
    buyerName,
    buyerCompany,
    produce,
    gradeRequested,
    quantity,
    unit,
    targetPrice,
    allocatedLotIds,
    deliveryAddress,
    deliveryDate,
    notes
  } = req.body;

  if (!produce || !quantity || !targetPrice) {
    return res.status(400).json({ error: 'Produce, quantity, and target price are required.' });
  }

  const poNumber = `PO-2024-00${Math.floor(200 + Math.random() * 800)}`;
  const totalAmount = parseFloat(quantity) * parseFloat(targetPrice);

  const newOrder = {
    id: poNumber,
    buyerId: buyerId || 'usr_buyer_priya',
    buyerName: buyerName || 'Priya Sharma',
    buyerCompany: buyerCompany || 'Grain Millers & Exporters Ltd',
    produce,
    gradeRequested: gradeRequested || 'Grade A',
    quantity: parseFloat(quantity),
    unit: unit || 'kg',
    targetPrice: parseFloat(targetPrice),
    totalAmount,
    status: 'SUBMITTED', // DRAFT -> SUBMITTED -> CONFIRMED -> PARTIALLY_FULFILLED -> FULFILLED -> DELIVERED
    allocatedLotIds: allocatedLotIds || [],
    deliveryAddress: deliveryAddress || 'Food Processing Park, Hyderabad',
    deliveryDate: deliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    paymentStatus: 'ESCROW_FUNDED',
    notes: notes || 'Standard export packaging requested',
    createdAt: new Date().toISOString()
  };

  db.create('orders', newOrder);

  // If lots were allocated, update lot status to ALLOCATED
  if (allocatedLotIds && allocatedLotIds.length) {
    allocatedLotIds.forEach(lId => {
      const lot = db.findById('lots', lId);
      if (lot && (lot.status === 'ACCEPTED' || lot.status === 'STORED')) {
        db.update('lots', lId, {
          status: 'ALLOCATED',
          assignedBuyerId: newOrder.buyerId,
          assignedPoId: newOrder.id,
          timeline: [
            ...lot.timeline,
            {
              stage: 'ALLOCATED',
              label: 'Allocated to Buyer Order',
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              location: 'Warangal Hub',
              actor: newOrder.buyerName,
              notes: `Bound to purchase order ${newOrder.id}`
            }
          ]
        });
      }
    });
  }

  recordAudit(buyerName, 'Buyer', 'CREATE_PURCHASE_ORDER', 'PurchaseOrder', poNumber, 'NONE', 'SUBMITTED', `PO created for ${quantity}kg ${produce} (₹${totalAmount})`);

  res.status(201).json({
    success: true,
    order: newOrder,
    message: `Purchase Order ${poNumber} created successfully.`
  });
});

router.patch('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, notes, actorName } = req.body;

  const order = db.findById('orders', id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const prev = order.status;
  const updated = db.update('orders', id, { status, notes: notes || order.notes });

  recordAudit(actorName || 'Operations', 'Procurement', 'UPDATE_PO_STATUS', 'PurchaseOrder', id, prev, status, notes || 'PO lifecycle advancement');

  res.json({ success: true, order: updated });
});

// ==========================================
// 6. WAREHOUSE & INVENTORY MANAGEMENT
// ==========================================
router.get('/warehouse', (req, res) => {
  res.json(db.data.warehouse);
});

router.post('/warehouse/move', (req, res) => {
  const { lotId, fromSection, toSection, quantity, action, actorName } = req.body;
  const warehouse = db.data.warehouse;

  const moveLog = {
    id: `MOV-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    lotId: lotId || 'LOT-2026-00125',
    from: fromSection,
    to: toSection,
    quantity: quantity || '1,000 kg',
    actor: actorName || 'Ramesh Varma',
    action: action || 'MOVE'
  };

  warehouse.movementHistory.unshift(moveLog);
  db.saveToFile();

  recordAudit(actorName || 'Ramesh Varma', 'Collection Center Manager', 'WAREHOUSE_MOVE', 'Warehouse', lotId, fromSection, toSection, `Moved ${quantity} from ${fromSection} to ${toSection}`);

  res.json({ success: true, movement: moveLog, warehouse });
});

// ==========================================
// 7. LOGISTICS & SHIPMENTS
// ==========================================
router.get('/shipments', (req, res) => {
  res.json(db.get('shipments'));
});

router.get('/shipments/:id', (req, res) => {
  const shipment = db.findById('shipments', req.params.id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
  res.json(shipment);
});

router.patch('/shipments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, currentLocation, progressPercent, waypointIndex, actorName } = req.body;

  const shipment = db.findById('shipments', id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

  const prev = shipment.status;
  const updates = {};
  if (status) updates.status = status;
  if (currentLocation) updates.currentLocation = currentLocation;
  if (progressPercent !== undefined) updates.progressPercent = progressPercent;

  if (waypointIndex !== undefined && shipment.routeWaypoints[waypointIndex]) {
    shipment.routeWaypoints[waypointIndex].passed = true;
    shipment.routeWaypoints[waypointIndex].time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    updates.routeWaypoints = shipment.routeWaypoints;
  }

  if (status === 'DELIVERED') {
    updates.actualDelivery = new Date().toISOString();
    updates.progressPercent = 100;

    // Update associated lots to DELIVERED
    if (shipment.lotIds && shipment.lotIds.length) {
      shipment.lotIds.forEach(lId => {
        const lot = db.findById('lots', lId);
        if (lot) {
          db.update('lots', lId, {
            status: 'DELIVERED',
            timeline: [
              ...lot.timeline,
              {
                stage: 'DELIVERED',
                label: 'Delivered to Final Buyer',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                location: shipment.destination,
                actor: shipment.driverName + ' & Consignee',
                notes: `Delivered via truck ${shipment.vehicleNumber}`
              }
            ]
          });
        }
      });
    }
  }

  const updatedShipment = db.update('shipments', id, updates);

  recordAudit(actorName || shipment.driverName, 'Logistics', 'UPDATE_SHIPMENT_STATUS', 'Shipment', id, prev, status || prev, currentLocation || 'Waypoint update');

  res.json({ success: true, shipment: updatedShipment });
});

// ==========================================
// 8. SETTLEMENTS & DISPUTES
// ==========================================
router.get('/settlements', (req, res) => {
  const { farmerId } = req.query;
  let settlements = db.get('settlements');
  if (farmerId) settlements = settlements.filter(s => s.farmerId === farmerId);
  res.json(settlements);
});

router.post('/settlements/pay/:id', (req, res) => {
  const { id } = req.params;
  const settlement = db.findById('settlements', id);
  if (!settlement) return res.status(404).json({ error: 'Settlement not found' });

  const ref = `UPI-RBI-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const updated = db.update('settlements', id, {
    status: 'PROCESSED',
    paymentReference: ref,
    paidAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  });

  recordAudit('Platform Admin', 'Admin', 'PROCESS_SETTLEMENT', 'Settlement', id, 'PENDING_APPROVAL', 'PROCESSED', `Paid ₹${settlement.finalAmount} to ${settlement.farmerName} via ${ref}`);

  pushNotification(
    settlement.farmerId,
    'FARMER',
    'Settlement Disbursed',
    `₹${settlement.finalAmount.toLocaleString('en-IN')} has been disbursed for Lot ${settlement.lotId}. Ref: ${ref}`,
    'success'
  );

  res.json({ success: true, settlement: updated });
});

router.get('/disputes', (req, res) => {
  res.json(db.get('disputes'));
});

router.post('/disputes', (req, res) => {
  const { farmerId, farmerName, lotId, category, title, description, evidenceImages } = req.body;

  if (!lotId || !category || !description) {
    return res.status(400).json({ error: 'Lot ID, category, and description are required' });
  }

  const disputeId = `DSP-${Math.floor(100 + Math.random() * 900)}`;
  const newDispute = {
    id: disputeId,
    farmerId: farmerId || 'usr_farmer_ravi',
    farmerName: farmerName || 'Ravi Kumar',
    lotId,
    category,
    title: title || `${category} on ${lotId}`,
    description,
    evidenceImages: evidenceImages || [],
    status: 'RAISED', // RAISED -> UNDER_REVIEW -> INVESTIGATION -> RESOLVED
    timeline: [
      {
        status: 'RAISED',
        date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        note: 'Dispute submitted by farmer'
      }
    ],
    resolutionNotes: null,
    createdAt: new Date().toISOString()
  };

  db.create('disputes', newDispute);
  recordAudit(farmerName, 'Farmer', 'RAISE_DISPUTE', 'Dispute', disputeId, 'NONE', 'RAISED', `Dispute on ${lotId}: ${category}`);

  pushNotification(
    'usr_admin_anita',
    'ADMIN',
    'New Dispute Raised',
    `Farmer ${farmerName} raised dispute ${disputeId} on lot ${lotId} (${category}).`,
    'warning'
  );

  res.status(201).json({ success: true, dispute: newDispute });
});

router.patch('/disputes/:id', (req, res) => {
  const { id } = req.params;
  const { status, note, resolutionNotes, actorName } = req.body;

  const dispute = db.findById('disputes', id);
  if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

  const prev = dispute.status;
  const timelineEntry = {
    status: status || prev,
    date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    note: note || `Dispute moved to ${status}`
  };

  const updates = {
    timeline: [...dispute.timeline, timelineEntry]
  };

  if (status) updates.status = status;
  if (resolutionNotes) updates.resolutionNotes = resolutionNotes;

  const updated = db.update('disputes', id, updates);

  recordAudit(actorName || 'Anita Roy', 'Admin', 'UPDATE_DISPUTE', 'Dispute', id, prev, status || prev, note || 'Dispute resolution progression');

  res.json({ success: true, dispute: updated });
});

// ==========================================
// 9. ANALYTICS & AUDIT LOGS
// ==========================================
router.get('/analytics', (req, res) => {
  const lots = db.get('lots');
  const orders = db.get('orders');
  const settlements = db.get('settlements');
  const shipments = db.get('shipments');
  const disputes = db.get('disputes');

  const totalProcuredKg = lots
    .filter(l => l.status === 'ACCEPTED' || l.status === 'STORED' || l.status === 'ALLOCATED' || l.status === 'DELIVERED')
    .reduce((sum, l) => sum + (l.quantity || 0), 0);

  const totalValueRupees = settlements.reduce((sum, s) => sum + (s.finalAmount || 0), 0);
  const activeShipmentsCount = shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'DISPATCHED').length;
  const pendingDisputesCount = disputes.filter(d => d.status !== 'RESOLVED').length;

  const qualityDistribution = [
    { grade: 'Grade A', count: lots.filter(l => l.qualityGrade === 'Grade A').length, color: '#2d6a4f' },
    { grade: 'Grade B', count: lots.filter(l => l.qualityGrade === 'Grade B').length, color: '#40916c' },
    { grade: 'Grade C', count: lots.filter(l => l.qualityGrade === 'Grade C').length, color: '#d4a373' },
    { grade: 'Pending', count: lots.filter(l => !l.qualityGrade || l.qualityGrade === 'Pending').length, color: '#a0aec0' }
  ];

  const procurementTrends = [
    { month: 'Apr', volumeTons: 120, valueLakhs: 48 },
    { month: 'May', volumeTons: 180, valueLakhs: 72 },
    { month: 'Jun', volumeTons: 250, valueLakhs: 98 },
    { month: 'Jul', volumeTons: 310, valueLakhs: 132 },
    { month: 'Aug', volumeTons: 420, valueLakhs: 185 },
    { month: 'Sep (MTD)', volumeTons: 145, valueLakhs: 64 }
  ];

  const cropBreakdown = [
    { crop: 'Rice', tons: 450, percentage: 38 },
    { crop: 'Wheat', tons: 320, percentage: 27 },
    { crop: 'Cotton', tons: 210, percentage: 18 },
    { crop: 'Maize', tons: 120, percentage: 10 },
    { crop: 'Vegetables', tons: 85, percentage: 7 }
  ];

  const regionWise = [
    { region: 'Telangana', tons: 480 },
    { region: 'Andhra Pradesh', tons: 340 },
    { region: 'Karnataka', tons: 210 },
    { region: 'Maharashtra', tons: 155 }
  ];

  res.json({
    kpis: {
      farmersConnected: 1840,
      produceProcuredTons: Math.round(totalProcuredKg / 1000) || 540,
      activeBuyers: 42,
      successfulDeliveries: 128,
      procurementValue: totalValueRupees,
      warehouseCapacityPercent: db.data.warehouse.occupiedTons,
      activeShipments: activeShipmentsCount,
      pendingDisputes: pendingDisputesCount
    },
    qualityDistribution,
    procurementTrends,
    cropBreakdown,
    regionWise
  });
});

router.get('/audit-logs', (req, res) => {
  res.json(db.get('auditLogs'));
});

router.get('/notifications', (req, res) => {
  const { role, userId } = req.query;
  let notifs = db.get('notifications');
  if (role) notifs = notifs.filter(n => n.role === role.toUpperCase() || n.role === 'ALL');
  if (userId) notifs = notifs.filter(n => n.userId === userId);
  res.json(notifs);
});

router.patch('/notifications/:id/read', (req, res) => {
  const notif = db.update('notifications', req.params.id, { isRead: true });
  res.json({ success: true, notification: notif });
});

// ==========================================
// 10. ML CROP PRICE DETECTION & MANDI TRENDS
// ==========================================
router.post('/ml/predict-price', (req, res) => {
  try {
    const { cropName, variety, grade, region, quantityKg, moisturePercent, defectPercent, arrivalVolumeTons } = req.body;
    const prediction = predictCropPrice({
      cropName,
      variety,
      grade,
      region,
      quantityKg,
      moisturePercent,
      defectPercent,
      arrivalVolumeTons
    });
    res.json({ success: true, ...prediction });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute ML price prediction', details: err.message });
  }
});

router.get('/ml/price-trends', (req, res) => {
  const { crop } = req.query;
  const trends = getHistoricalPriceTrends(crop || 'Rice');
  res.json(trends);
});

router.get('/crops/images', (req, res) => {
  res.json(CROP_IMAGES);
});

export default router;
