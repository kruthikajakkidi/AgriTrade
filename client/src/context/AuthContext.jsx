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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tagline: 'KPIs, Audit Trail & Settlement Approvals'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agritrade_user');
    return saved ? JSON.parse(saved) : DEMO_PROFILES.FARMER;
  });

  const [token, setToken] = useState(() => localStorage.getItem('agritrade_token') || 'demo_token');

  useEffect(() => {
    localStorage.setItem('agritrade_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (roleKey) => {
    const profile = DEMO_PROFILES[roleKey];
    if (profile) {
      setCurrentUser(profile);
      setToken(`token_${profile.id}`);
      localStorage.setItem('agritrade_token', `token_${profile.id}`);
    }
  };

  const login = async (identifier, role) => {
    try {
      const data = await api.login(identifier, role);
      if (data.user) {
        setCurrentUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
    } catch (e) {
      // Fallback to local profile
      const foundRole = Object.values(DEMO_PROFILES).find(p => p.role === role);
      if (foundRole) {
        setCurrentUser(foundRole);
        return { success: true, user: foundRole };
      }
    }
    return { success: false, error: 'Login failed' };
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data.user) {
        setCurrentUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
    } catch (e) {
      const newUser = {
        ...userData,
        id: `usr_${Date.now()}`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      setCurrentUser(newUser);
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setCurrentUser(DEMO_PROFILES.FARMER);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
      switchRole,
      login,
      register,
      logout,
      isFarmer: currentUser.role === 'FARMER',
      isBuyer: currentUser.role === 'BUYER',
      isInspector: currentUser.role === 'QUALITY_INSPECTOR',
      isManager: currentUser.role === 'COLLECTION_CENTER',
      isLogistics: currentUser.role === 'LOGISTICS',
      isAdmin: currentUser.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
