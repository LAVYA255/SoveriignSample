import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import RealEstatePage from "./pages/RealEstatePage";
import InvoiceFinancingPage from "./pages/InvoiceFinancingPage";
import SupplyChainPage from "./pages/SupplyChainPage";
import AssetDetailPage from "./pages/AssetDetailPage";
import LiveMarketPage from "./pages/LiveMarketPage";
import PortfolioPage from "./pages/PortfolioPage";
import TransactionsPage from "./pages/TransactionsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Intro />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/real-estate"
        element={
          <ProtectedRoute>
            <RealEstatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice-financing"
        element={
          <ProtectedRoute>
            <InvoiceFinancingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supply-chain"
        element={
          <ProtectedRoute>
            <SupplyChainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asset/:slug"
        element={
          <ProtectedRoute>
            <AssetDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/live-market"
        element={
          <ProtectedRoute>
            <LiveMarketPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <PortfolioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
