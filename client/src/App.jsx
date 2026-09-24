import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Toast } from './components/common/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { FarmerDashboard } from './pages/Farmer/FarmerDashboard';
import { SellProduceWizard } from './pages/Farmer/SellProduceWizard';
import { FarmerLotsView } from './pages/Farmer/FarmerLotsView';
import { SettlementView } from './pages/Farmer/SettlementView';
import { DisputeView } from './pages/Farmer/DisputeView';
import { ProduceLotDetails } from './pages/ProduceLotDetails';
import { CollectionDashboard } from './pages/CollectionCenter/CollectionDashboard';
import { InspectorDashboard } from './pages/Inspector/InspectorDashboard';
import { BuyerDashboard } from './pages/Buyer/BuyerDashboard';
import { PurchaseOrdersView } from './pages/Buyer/PurchaseOrdersView';
import { LogisticsDashboard } from './pages/Logistics/LogisticsDashboard';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { PublicTraceabilityPage } from './pages/Traceability/PublicTraceabilityPage';

// Dynamic role router for /dashboard
const DynamicDashboard = () => {
  const { currentUser } = useAuth();

  switch (currentUser.role) {
    case 'FARMER':
      return <FarmerDashboard />;
    case 'BUYER':
      return <BuyerDashboard />;
    case 'COLLECTION_CENTER':
      return <CollectionDashboard />;
    case 'QUALITY_INSPECTOR':
      return <InspectorDashboard />;
    case 'LOGISTICS':
      return <LogisticsDashboard />;
    case 'ADMIN':
    default:
      return <AdminDashboard />;
  }
};

// Layout Container
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // On public or auth pages, don't show full app shell
  const isCleanPage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/trace/');

  if (isCleanPage) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        {children}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>

      <MobileBottomNav />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              {/* Public & Auth */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/trace/:lotId" element={<PublicTraceabilityPage />} />

              {/* Dynamic Role Dashboard */}
              <Route path="/dashboard" element={<DynamicDashboard />} />

              {/* Farmer Routes */}
              <Route path="/farmer/sell" element={<SellProduceWizard />} />
              <Route path="/farmer/lots" element={<FarmerLotsView />} />
              <Route path="/farmer/orders" element={<PurchaseOrdersView />} />
              <Route path="/farmer/payments" element={<SettlementView />} />
              <Route path="/farmer/disputes" element={<DisputeView />} />

              {/* Lot Details */}
              <Route path="/lot/:id" element={<ProduceLotDetails />} />

              {/* Buyer Routes */}
              <Route path="/buyer/marketplace" element={<BuyerDashboard />} />
              <Route path="/buyer/orders" element={<PurchaseOrdersView />} />
              <Route path="/buyer/deliveries" element={<LogisticsDashboard />} />
              <Route path="/buyer/procurement" element={<AdminDashboard />} />

              {/* Collection Center Routes */}
              <Route path="/collection/incoming" element={<CollectionDashboard />} />
              <Route path="/collection/lots" element={<FarmerLotsView />} />
              <Route path="/collection/warehouse" element={<CollectionDashboard />} />
              <Route path="/collection/dispatch" element={<LogisticsDashboard />} />

              {/* Quality Inspector Routes */}
              <Route path="/inspector/queue" element={<InspectorDashboard />} />
              <Route path="/inspector/reports" element={<InspectorDashboard />} />
              <Route path="/inspector/history" element={<InspectorDashboard />} />

              {/* Logistics Fleet Routes */}
              <Route path="/logistics/shipments" element={<LogisticsDashboard />} />
              <Route path="/logistics/tracking" element={<LogisticsDashboard />} />
              <Route path="/logistics/fleet" element={<LogisticsDashboard />} />
              <Route path="/logistics/history" element={<LogisticsDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin/analytics" element={<AdminDashboard />} />
              <Route path="/admin/lots" element={<FarmerLotsView />} />
              <Route path="/admin/orders" element={<PurchaseOrdersView />} />
              <Route path="/admin/warehouse" element={<CollectionDashboard />} />
              <Route path="/admin/shipments" element={<LogisticsDashboard />} />
              <Route path="/admin/settlements" element={<SettlementView />} />
              <Route path="/admin/disputes" element={<DisputeView />} />
              <Route path="/admin/audit" element={<AdminDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
