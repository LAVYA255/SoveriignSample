import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import RealEstatePage from "./pages/RealEstatePage";
import InvoiceFinancingPage from "./pages/InvoiceFinancingPage";
import SupplyChainPage from "./pages/SupplyChainPage";
import AssetDetailPage from "./pages/AssetDetailPage";
import LiveMarketPage from "./pages/LiveMarketPage";
import PortfolioPage from "./pages/PortfolioPage";
import TransactionsPage from "./pages/TransactionsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
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
          <ProtectedRoute requireAdmin={true}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
