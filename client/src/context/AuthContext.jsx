import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const DEMO_PROFILES = {
  FARMER: {
    id: 'usr_farmer_ravi',
    name: 'Ravi Kumar',
    email: 'ravi.farmer@agritrade.org',
    role: 'FARMER',
    roleTitle: 'Farmer / Producer',
    location: 'Siddipet, Telangana',
    farmName: 'Ravi Organic Green Farms (12 Acres)',
    avatar: '',
    tagline: 'Farmer-Friendly Mobile Experience'
  },
  COLLECTION_CENTER: {
    id: 'usr_mgr_ramesh',
    name: 'Ramesh Varma',
    email: 'ramesh.hub@agritrade.org',
    role: 'COLLECTION_CENTER',
    roleTitle: 'Collection Center Manager',
    location: 'Warangal, Telangana',
    centerName: 'Warangal Agri-Logistics Hub #4',
    avatar: '',
    tagline: 'Intake, Weighing & Warehouse Bays'
  },
  QUALITY_INSPECTOR: {
    id: 'usr_insp_suresh',
    name: 'Dr. Suresh Patel',
    email: 'suresh.patel@agriquality.gov.in',
    role: 'QUALITY_INSPECTOR',
    roleTitle: 'Quality Inspector',
    location: 'Regional Testing Lab #2',
    certificationNumber: 'AGMARK-QI-2024-88',
    avatar: '',
    tagline: 'AI-Assisted Quality & Lab Grading'
  },
  BUYER: {
    id: 'usr_buyer_priya',
    name: 'Priya Sharma',
    email: 'priya.procurement@grainmillers.com',
    role: 'BUYER',
    roleTitle: 'Enterprise Procurement Buyer',
    location: 'Hyderabad, Telangana',
    organization: 'Grain Millers & Exporters Ltd',
    avatar: '',
    tagline: 'Marketplace, AI Match & PO Management'
  },
  LOGISTICS: {
    id: 'usr_log_balu',
    name: 'Balu Nayak',
    email: 'balu.fleet@kisanlogistics.com',
    role: 'LOGISTICS',
    roleTitle: 'Logistics Fleet Coordinator',
    location: 'Secunderabad Yard',
    agency: 'Kisan Express Cargo & Reefer Fleet',
    avatar: '',
    tagline: 'Fleet Tracking & Route Waypoints'
  },
  ADMIN: {
    id: 'usr_admin_anita',
    name: 'Anita Roy',
    email: 'anita.admin@agritrade.org',
    role: 'ADMIN',
    roleTitle: 'Platform Administrator',
    location: 'New Delhi HQ',
    department: 'Platform Governance & Operations',
    avatar: '',
    tagline: 'KPIs, Audit Trail & Settlement Approvals'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agritrade_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('agritrade_token') || null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agritrade_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('agritrade_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('agritrade_token', token);
    } else {
      localStorage.removeItem('agritrade_token');
    }
  }, [token]);

  const switchRole = (roleKey) => {
    const profile = DEMO_PROFILES[roleKey];
    if (profile) {
      setCurrentUser(profile);
      setToken(`token_${profile.id}`);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      if (data.user && data.token) {
        setCurrentUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data.user && data.token) {
        setCurrentUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('agritrade_user');
    localStorage.removeItem('agritrade_token');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
      switchRole,
      login,
      register,
      logout,
      isAuthenticated: !!currentUser,
      isFarmer: currentUser?.role === 'FARMER',
      isBuyer: currentUser?.role === 'BUYER',
      isInspector: currentUser?.role === 'QUALITY_INSPECTOR',
      isManager: currentUser?.role === 'COLLECTION_CENTER',
      isLogistics: currentUser?.role === 'LOGISTICS',
      isAdmin: currentUser?.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
