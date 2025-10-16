import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalAlerts from './components/GlobalAlerts';
import GlobalChatbot from './components/GlobalChatbot';
import LoadingScreen from './components/LoadingScreen';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const OverviewPage = lazy(() => import('./pages/dashboard/OverviewPage'));
const SalesPage = lazy(() => import('./pages/dashboard/SalesPage'));
const LaborPage = lazy(() => import('./pages/dashboard/LaborPage'));
const SpeedPage = lazy(() => import('./pages/dashboard/SpeedPage'));
const LoyaltyPage = lazy(() => import('./pages/dashboard/LoyaltyPage'));
const SpendPage = lazy(() => import('./pages/dashboard/SpendPage'));
const PnLPage = lazy(() => import('./pages/dashboard/PnLPage'));
const AIPage = lazy(() => import('./pages/dashboard/AIPage'));
const CameraPage = lazy(() => import('./pages/dashboard/CameraPage'));
const CameraLivePage = lazy(() => import('./pages/dashboard/CameraLivePage'));
const MyShiftsPage = lazy(() => import('./pages/dashboard/MyShiftsPage'));
const PayrollPage = lazy(() => import('./pages/dashboard/PayrollPage'));
const InventoryPage = lazy(() => import('./pages/dashboard/InventoryPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout><OverviewPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/sales"
            element={
              <ProtectedRoute>
                <DashboardLayout><SalesPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/labor"
            element={
              <ProtectedRoute>
                <DashboardLayout><LaborPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/speed"
            element={
              <ProtectedRoute>
                <DashboardLayout><SpeedPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/loyalty"
            element={
              <ProtectedRoute>
                <DashboardLayout><LoyaltyPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/spend"
            element={
              <ProtectedRoute>
                <DashboardLayout><SpendPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pnl"
            element={
              <ProtectedRoute>
                <DashboardLayout><PnLPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ai"
            element={
              <ProtectedRoute>
                <DashboardLayout><AIPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/camera"
            element={
              <ProtectedRoute>
                <DashboardLayout><CameraPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/camera-live"
            element={
              <ProtectedRoute>
                <DashboardLayout><CameraLivePage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/schedule"
            element={
              <ProtectedRoute>
                <DashboardLayout><MyShiftsPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payroll"
            element={
              <ProtectedRoute>
                <DashboardLayout><PayrollPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/inventory"
            element={
              <ProtectedRoute>
                <DashboardLayout><InventoryPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>

        <GlobalAlerts />
        <GlobalChatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;
