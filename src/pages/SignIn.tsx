import { useState, useRef } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router';
import { trpc } from '@/providers/trpc';

export default function SignIn() {
  const { user, isLoading, role, setSession } = useAuth();
  const upsertMutation = trpc.auth.upsertSync.useMutation();
  const passwordHashRef = useRef<string | null>(null);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      setErrors({ general: 'Google sign-in failed. Please try again.' });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    
    if (isRegistering && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        passwordHashRef.current = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        console.log('Before createUserWithEmailAndPassword');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('After createUserWithEmailAndPassword', userCredential.user);
        await updateProfile(userCredential.user, { displayName: username });

        console.log('Before upsertSync, passwordHash:', passwordHashRef.current);
        const result = await upsertMutation.mutateAsync({
          id: userCredential.user.uid,
          email,
          username,
          passwordHash: passwordHashRef.current
        });
        console.log('After upsertSync, result:', result);
        
        passwordHashRef.current = null;
        setSession(result.id, result.role);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error('Auth error', error);
      if (error.code === 'auth/operation-not-allowed') {
        setErrors({ general: 'Email/Password sign-in is not enabled. Please contact the administrator.' });
      } else {
        setErrors({ general: error.message || 'Authentication failed. Please check your credentials.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        <h1 className="text-3xl font-light text-white mb-2">
          {isRegistering ? 'Create Account' : 'Welcome to'} <span className="font-semibold text-orange-500">Sovriigne</span>
        </h1>
        <p className="text-white/60 text-center mb-8">
          {isRegistering ? 'Sign up to start investing.' : 'Sign in to access your tokenized RWA portfolio.'}
        </p>

        {errors.general && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="w-full flex flex-col gap-4 mb-6">
          {isRegistering && (
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full bg-[#1A1A1A] text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className={`w-full bg-[#1A1A1A] text-white border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}
              required
            />
            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={`w-full bg-[#1A1A1A] text-white border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}
              required
            />
            {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          {isRegistering && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={`w-full bg-[#1A1A1A] text-white border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}
                required
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white font-medium py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? 'Processing...' : isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="w-full flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-white/40 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        <p className="text-white/60 text-sm mt-8">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrors({});
            }}
            className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
          >
            {isRegistering ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
