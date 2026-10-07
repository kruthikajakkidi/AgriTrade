const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://agritrade-5oq3.onrender.com/api' : 'https://agritrade-5oq3.onrender.com/api');

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return await res.json();
    } catch (e) {
      console.warn('API health check failed:', e);
      return { status: 'offline' };
    }
  },

  // Auth
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed. Please check your details.');
    }
    return data;
  },

  getCurrentUser: async (token) => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Unauthorized');
    }
    return data;
  },

  getUsers: async (role) => {
    const url = role ? `${BASE_URL}/users?role=${role}` : `${BASE_URL}/users`;
    const res = await fetch(url);
    return await res.json();
  },

  // Lots
  getLots: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/lots${query ? `?${query}` : ''}`);
    return await res.json();
  },

  getLotById: async (id) => {
    const res = await fetch(`${BASE_URL}/lots/${id}`);
    if (!res.ok) throw new Error('Lot not found');
    return await res.json();
  },

  createLot: async (lotData) => {
    const res = await fetch(`${BASE_URL}/lots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lotData)
    });
    return await res.json();
  },

  updateLotStatus: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/lots/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
    return data;
  },

  predictQuality: async (id, metrics) => {
    const res = await fetch(`${BASE_URL}/lots/${id}/predict-quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    });
    return await res.json();
  },

  inspectLot: async (id, inspectionData) => {
    const res = await fetch(`${BASE_URL}/lots/${id}/inspect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inspectionData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit inspection');
    return data;
  },

  // Orders
  getOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/orders${query ? `?${query}` : ''}`);
    return await res.json();
  },

  createOrder: async (orderData) => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  },

  updateOrderStatus: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  // Warehouse
  getWarehouse: async () => {
    const res = await fetch(`${BASE_URL}/warehouse`);
    return await res.json();
  },

  moveWarehouseStock: async (payload) => {
    const res = await fetch(`${BASE_URL}/warehouse/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  // Shipments
  getShipments: async () => {
    const res = await fetch(`${BASE_URL}/shipments`);
    return await res.json();
  },

  getShipmentById: async (id) => {
    const res = await fetch(`${BASE_URL}/shipments/${id}`);
    return await res.json();
  },

  updateShipmentStatus: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/shipments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  // Settlements
  getSettlements: async (farmerId) => {
    const url = farmerId ? `${BASE_URL}/settlements?farmerId=${farmerId}` : `${BASE_URL}/settlements`;
    const res = await fetch(url);
    return await res.json();
  },

  paySettlement: async (id) => {
    const res = await fetch(`${BASE_URL}/settlements/pay/${id}`, {
      method: 'POST'
    });
    return await res.json();
  },

  // Disputes
  getDisputes: async () => {
    const res = await fetch(`${BASE_URL}/disputes`);
    return await res.json();
  },

  createDispute: async (disputeData) => {
    const res = await fetch(`${BASE_URL}/disputes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disputeData)
    });
    return await res.json();
  },

  updateDispute: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/disputes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  // Analytics & Audit
  getAnalytics: async () => {
    const res = await fetch(`${BASE_URL}/analytics`);
    return await res.json();
  },

  getAuditLogs: async () => {
    const res = await fetch(`${BASE_URL}/audit-logs`);
    return await res.json();
  },

  getNotifications: async (role, userId) => {
    const query = new URLSearchParams({ ...(role && { role }), ...(userId && { userId }) }).toString();
    const res = await fetch(`${BASE_URL}/notifications${query ? `?${query}` : ''}`);
    return await res.json();
  },

  markNotificationRead: async (id) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return await res.json();
  },

  resetDemoData: async () => {
    const res = await fetch(`${BASE_URL}/reset`, { method: 'POST' });
    return await res.json();
  },

  // ML Crop Price Detection
  predictCropPrice: async (params) => {
    const res = await fetch(`${BASE_URL}/ml/predict-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  },

  getPriceTrends: async (crop) => {
    const url = crop ? `${BASE_URL}/ml/price-trends?crop=${crop}` : `${BASE_URL}/ml/price-trends`;
    const res = await fetch(url);
    return await res.json();
  },

  getCropImages: async () => {
    const res = await fetch(`${BASE_URL}/crops/images`);
    return await res.json();
  },

  // Media / Cloudinary Upload
  uploadImage: async (file, folder = 'agritrade/uploads') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload image');
    return data;
  }
};
