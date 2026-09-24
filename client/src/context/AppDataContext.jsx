import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [lots, setLots] = useState([]);
  const [orders, setOrders] = useState([]);
  const [warehouse, setWarehouse] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        lotsData,
        ordersData,
        warehouseData,
        shipmentsData,
        settlementsData,
        disputesData,
        auditData,
        notifData,
        analyticsData
      ] = await Promise.all([
        api.getLots(),
        api.getOrders(),
        api.getWarehouse(),
        api.getShipments(),
        api.getSettlements(),
        api.getDisputes(),
        api.getAuditLogs(),
        api.getNotifications(currentUser?.role, currentUser?.id),
        api.getAnalytics()
      ]);

      setLots(lotsData || []);
      setOrders(ordersData || []);
      setWarehouse(warehouseData || null);
      setShipments(shipmentsData || []);
      setSettlements(settlementsData || []);
      setDisputes(disputesData || []);
      setAuditLogs(auditData || []);
      setNotifications(notifData || []);
      setAnalytics(analyticsData || null);
    } catch (err) {
      console.warn('Data fetch error, using local state:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Actions
  const createProduceLot = async (lotData) => {
    try {
      const res = await api.createLot({
        ...lotData,
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        farmerPhone: currentUser.phone
      });
      if (res.lot) {
        setLots(prev => [res.lot, ...prev]);
        showToast(`🎉 Produce submitted successfully! Lot ID: ${res.lot.id}`, 'success');
        fetchAllData();
        return res.lot;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const advanceLotStatus = async (lotId, targetStatus, metadata = {}) => {
    try {
      const res = await api.updateLotStatus(lotId, {
        targetStatus,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        ...metadata
      });
      if (res.lot) {
        setLots(prev => prev.map(l => l.id === lotId ? res.lot : l));
        showToast(`Status updated to ${targetStatus.replace(/_/g, ' ')}`, 'success');
        fetchAllData();
        return res.lot;
      }
    } catch (err) {
      showToast(err.message || 'Invalid state transition', 'error');
      throw err;
    }
  };

  const submitInspection = async (lotId, inspectionData) => {
    try {
      const res = await api.inspectLot(lotId, {
        ...inspectionData,
        inspectorName: currentUser.name,
        inspectorId: currentUser.id
      });
      if (res.lot) {
        setLots(prev => prev.map(l => l.id === lotId ? res.lot : l));
        showToast(`Inspection submitted: ${inspectionData.grade} (${inspectionData.decision})`, 'success');
        fetchAllData();
        return res.lot;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const createOrder = async (orderData) => {
    try {
      const res = await api.createOrder({
        ...orderData,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerCompany: currentUser.organization || 'Enterprise Buyer'
      });
      if (res.order) {
        setOrders(prev => [res.order, ...prev]);
        showToast(`Purchase order ${res.order.id} submitted!`, 'success');
        fetchAllData();
        return res.order;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status, notes) => {
    try {
      const res = await api.updateOrderStatus(orderId, { status, notes, actorName: currentUser.name });
      if (res.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.order : o));
        showToast(`PO status updated to ${status}`, 'success');
        fetchAllData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const updateShipment = async (shipmentId, updates) => {
    try {
      const res = await api.updateShipmentStatus(shipmentId, {
        ...updates,
        actorName: currentUser.name
      });
      if (res.shipment) {
        setShipments(prev => prev.map(s => s.id === shipmentId ? res.shipment : s));
        showToast(`Shipment ${shipmentId} updated`, 'success');
        fetchAllData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const moveWarehouseStock = async (moveData) => {
    try {
      const res = await api.moveWarehouseStock({
        ...moveData,
        actorName: currentUser.name
      });
      showToast(`Stock moved from ${moveData.fromSection} to ${moveData.toSection}`, 'success');
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const processSettlement = async (settlementId) => {
    try {
      const res = await api.paySettlement(settlementId);
      if (res.settlement) {
        setSettlements(prev => prev.map(s => s.id === settlementId ? res.settlement : s));
        showToast(`Payment of ₹${res.settlement.finalAmount.toLocaleString('en-IN')} disbursed!`, 'success');
        fetchAllData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const raiseDispute = async (disputeData) => {
    try {
      const res = await api.createDispute({
        ...disputeData,
        farmerId: currentUser.id,
        farmerName: currentUser.name
      });
      if (res.dispute) {
        setDisputes(prev => [res.dispute, ...prev]);
        showToast(`Dispute ${res.dispute.id} submitted for review`, 'info');
        fetchAllData();
        return res.dispute;
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const updateDispute = async (disputeId, updates) => {
    try {
      const res = await api.updateDispute(disputeId, {
        ...updates,
        actorName: currentUser.name
      });
      if (res.dispute) {
        setDisputes(prev => prev.map(d => d.id === disputeId ? res.dispute : d));
        showToast(`Dispute updated to ${updates.status || 'saved'}`, 'success');
        fetchAllData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      // local
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const resetAllData = async () => {
    await api.resetDemoData();
    showToast('Platform demo data reseeded to fresh baseline', 'info');
    fetchAllData();
  };

  return (
    <AppDataContext.Provider value={{
      lots,
      orders,
      warehouse,
      shipments,
      settlements,
      disputes,
      auditLogs,
      notifications,
      analytics,
      loading,
      toast,
      showToast,
      refreshData: fetchAllData,
      createProduceLot,
      advanceLotStatus,
      submitInspection,
      createOrder,
      updateOrderStatus,
      updateShipment,
      moveWarehouseStock,
      processSettlement,
      raiseDispute,
      updateDispute,
      markNotificationAsRead,
      resetAllData
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
