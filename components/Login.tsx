
import React, { useState } from 'react';
import { AppState, User } from '../types';
import { login, googleSignIn } from '../services/authService';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

interface LoginProps {
  setAppState: (state: AppState) => void;
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setAppState, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      console.error(err);
      alert(`Login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      const user = await googleSignIn();
      onLoginSuccess(user);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        alert("Domain not authorized! Please add this domain to your Firebase Console > Authentication > Settings > Authorized Domains.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        // Ignore
      } else {
        alert(`Google Sign In failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
        <button onClick={() => setAppState(AppState.LANDING)} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        
        <div className="text-center mb-8">
           <h1 className="text-3xl font-display font-bold text-slate-900">Welcome Back!</h1>
           <p className="text-slate-500 mt-2">Login to access your magical stories.</p>
        </div>

        {/* Google SSO */}
        <button 
          type="button"
          onClick={handleGoogle}
          disabled={isLoading}
          className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center hover:bg-slate-50 transition mb-6 active:scale-95 transform"
        >
           {isLoading ? (
             <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-500"></span>
           ) : (
             <>
               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
               </svg>
               Sign in with Google
             </>
           )}
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="px-3 text-slate-400 text-sm">or with email</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
              />
           </div>
           <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
              />
           </div>
           
           <button 
             type="submit"
             disabled={isLoading}
             className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-200 transition flex justify-center items-center"
           >
             {isLoading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : 'Log In'}
           </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account? <button onClick={() => setAppState(AppState.SIGNUP)} className="text-brand-600 font-bold hover:underline">Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
