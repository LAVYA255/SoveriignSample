import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode, 
  requireAdmin?: boolean 
}) {
  const { user, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
}
