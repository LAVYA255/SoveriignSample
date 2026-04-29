import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  
  return {
    user: context.firebaseUser,
    userData: context.userData,
    supabaseId: context.supabaseId,
    role: context.role,
    isAuthenticated: !!context.firebaseUser,
    isLoading: context.isLoading,
    logout: context.signOut,
    setSession: context.setSession,
  };
}
