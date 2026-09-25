import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
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

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dynamic role router for /dashboard
const DynamicDashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // On public, auth, or unauthenticated pages, show clean layout without sidebar
  const isCleanPage =
    !currentUser ||
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
              <Route path="/lot/:id" element={<ProduceLotDetails />} />
              <Route path="/buyer/marketplace" element={<BuyerDashboard />} />

              {/* Dynamic Role Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DynamicDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Farmer Routes */}
              <Route
                path="/farmer/sell"
                element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <SellProduceWizard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/lots"
                element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <FarmerLotsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/orders"
                element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <PurchaseOrdersView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/payments"
                element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <SettlementView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/disputes"
                element={
                  <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                    <DisputeView />
                  </ProtectedRoute>
                }
              />

              {/* Buyer Routes */}
              <Route
                path="/buyer/orders"
                element={
                  <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
                    <PurchaseOrdersView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/deliveries"
                element={
                  <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
                    <LogisticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/procurement"
                element={
                  <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Collection Center Routes */}
              <Route
                path="/collection/incoming"
                element={
                  <ProtectedRoute allowedRoles={['COLLECTION_CENTER', 'ADMIN']}>
                    <CollectionDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collection/lots"
                element={
                  <ProtectedRoute allowedRoles={['COLLECTION_CENTER', 'ADMIN']}>
                    <FarmerLotsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collection/warehouse"
                element={
                  <ProtectedRoute allowedRoles={['COLLECTION_CENTER', 'ADMIN']}>
                    <CollectionDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collection/dispatch"
                element={
                  <ProtectedRoute allowedRoles={['COLLECTION_CENTER', 'ADMIN']}>
                    <LogisticsDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Quality Inspector Routes */}
              <Route
                path="/inspector/queue"
                element={
                  <ProtectedRoute allowedRoles={['QUALITY_INSPECTOR', 'ADMIN']}>
                    <InspectorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inspector/reports"
                element={
                  <ProtectedRoute allowedRoles={['QUALITY_INSPECTOR', 'ADMIN']}>
                    <InspectorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inspector/history"
                element={
                  <ProtectedRoute allowedRoles={['QUALITY_INSPECTOR', 'ADMIN']}>
                    <InspectorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Logistics Fleet Routes */}
              <Route
                path="/logistics/shipments"
                element={
                  <ProtectedRoute allowedRoles={['LOGISTICS', 'ADMIN']}>
                    <LogisticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logistics/tracking"
                element={
                  <ProtectedRoute allowedRoles={['LOGISTICS', 'ADMIN']}>
                    <LogisticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logistics/fleet"
                element={
                  <ProtectedRoute allowedRoles={['LOGISTICS', 'ADMIN']}>
                    <LogisticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logistics/history"
                element={
                  <ProtectedRoute allowedRoles={['LOGISTICS', 'ADMIN']}>
                    <LogisticsDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/lots"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <FarmerLotsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <PurchaseOrdersView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/warehouse"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CollectionDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/shipments"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <LogisticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settlements"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SettlementView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/disputes"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DisputeView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

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
