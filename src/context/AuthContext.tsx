import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, signOut as firebaseSignOut } from '../lib/firebaseClient';
import { trpc } from '@/providers/trpc';

type AuthContextType = {
  firebaseUser: FirebaseUser | null;
  userData: any | null;
  supabaseId: string | null;
  role: 'user' | 'admin' | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  setSession: (id: string, newRole: 'user' | 'admin') => void;
};

export const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  userData: null,
  supabaseId: null,
  role: null,
  isLoading: true,
  signOut: async () => {},
  setSession: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const skipUpsertRef = useRef(false);

  const setSession = (id: string, newRole: 'user' | 'admin') => {
    skipUpsertRef.current = true;
    setSupabaseId(id);
    setRole(newRole);
    // Note: userData might be stale here if we don't fetch it, but session is usually for login
  };

  const upsertMutation = trpc.auth.upsertSync.useMutation();

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user && user.email) {
        if (skipUpsertRef.current) {
          skipUpsertRef.current = false;
          setIsLoading(false);
          return;
        }

        console.log('[Auth] onAuthStateChanged fired for:', user.email, '| uid:', user.uid);
        try {
          console.log('[Auth] Calling upsertSync mutation...');
          const result = await upsertMutation.mutateAsync({
            id: user.uid,
            email: user.email,
            username: user.displayName || user.email.split('@')[0],
            passwordHash: null
          });
          console.log('[Auth] upsertSync succeeded:', result);
          setUserData(result);
          setSupabaseId(result.id);
          setRole(result.role as 'user' | 'admin');
        } catch (error) {
          console.error('[Auth] upsertSync FAILED:', error);
          setUserData(null);
          setSupabaseId(null);
          setRole(null);
        }
      } else {
        setUserData(null);
        setSupabaseId(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut();
      setUserData(null);
    } catch (err) {
      console.error('Sign out error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, userData, supabaseId, role, isLoading, signOut, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};
