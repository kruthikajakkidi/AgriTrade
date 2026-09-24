/**
 * Strict Supply Chain State Transition Machine
 * Validates and records state changes for ProduceLots
 */

export const LOT_STATES = {
  CREATED: 'CREATED',
  RECEIVED: 'RECEIVED',
  INSPECTION_PENDING: 'INSPECTION_PENDING',
  INSPECTED: 'INSPECTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  STORED: 'STORED',
  ALLOCATED: 'ALLOCATED',
  DISPATCHED: 'DISPATCHED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED'
};

export const ALLOWED_TRANSITIONS = {
  CREATED: ['RECEIVED'],
  RECEIVED: ['INSPECTION_PENDING'],
  INSPECTION_PENDING: ['INSPECTED'],
  INSPECTED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['STORED', 'ALLOCATED'], // Can be allocated directly or stored in bay
  STORED: ['ALLOCATED', 'DISPATCHED'],
  ALLOCATED: ['DISPATCHED'],
  DISPATCHED: ['IN_TRANSIT'],
  IN_TRANSIT: ['DELIVERED'],
  REJECTED: [], // Terminal or return to farmer
  DELIVERED: [] // Terminal
};

export const validateStateTransition = (currentStatus, targetStatus) => {
  if (!currentStatus) return { valid: false, error: 'Current status is missing' };
  if (!targetStatus) return { valid: false, error: 'Target status is missing' };
  
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid state transition from '${currentStatus}' to '${targetStatus}'. Allowed next states: [${(allowed || []).join(', ') || 'None (Terminal state)'}]. Direct jumping is prohibited.`
    };
  }
  
  return { valid: true };
};

export const getTimelineStageDetails = (stage) => {
  switch (stage) {
    case 'CREATED':
      return { label: 'Produce Lot Created', color: 'blue' };
    case 'RECEIVED':
      return { label: 'Received at Hub & Weighed', color: 'amber' };
    case 'INSPECTION_PENDING':
      return { label: 'Queued for Quality Check', color: 'amber' };
    case 'INSPECTED':
      return { label: 'Quality Inspected', color: 'indigo' };
    case 'ACCEPTED':
      return { label: 'Procurement Accepted', color: 'emerald' };
    case 'REJECTED':
      return { label: 'Produce Rejected', color: 'red' };
    case 'STORED':
      return { label: 'Stored in Warehouse Bay', color: 'teal' };
    case 'ALLOCATED':
      return { label: 'Allocated to Purchase Order', color: 'purple' };
    case 'DISPATCHED':
      return { label: 'Loaded on Vehicle & Dispatched', color: 'cyan' };
    case 'IN_TRANSIT':
      return { label: 'In Transit to Destination', color: 'amber' };
    case 'DELIVERED':
      return { label: 'Delivered to Buyer', color: 'green' };
    default:
      return { label: stage, color: 'gray' };
  }
};
