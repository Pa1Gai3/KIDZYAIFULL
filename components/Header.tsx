

import React, { useState } from 'react';
import { AppState, User } from '../types';
import { BookOpen, Crown, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { logout } from '../services/authService';

interface HeaderProps {
  setAppState: (state: AppState) => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setAppState, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItem = ({ label, onClick, mobile = false }: { label: string, onClick: () => void, mobile?: boolean }) => (
    <button 
      onClick={() => {
        onClick();
        setIsMenuOpen(false);
      }}
      className={`font-display font-bold transition ${
        mobile 
        ? 'w-full text-left py-3 text-xl text-slate-800 border-b border-slate-100' 
        : 'text-slate-600 hover:text-brand-600 text-base'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Fixed Sticky Header - Larger Size */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-50/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setAppState(AppState.LANDING)}
          >
            <div className="bg-gradient-to-br from-brand-500 to-magic-500 text-white p-2.5 rounded-xl shadow-lg group-hover:rotate-12 transition transform">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Kidzy<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-magic-500">Color</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            <NavItem label="How it Works" onClick={() => setAppState(AppState.LANDING)} />
            <NavItem label="Pricing" onClick={() => setAppState(AppState.PRICING)} />
            <NavItem label="Templates" onClick={() => {}} />
          </nav>

          {/* User / Action Area */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 bg-white rounded-full pl-1.5 pr-4 py-1.5 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <img 
                    src={user.avatarUrl} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full border-2 border-slate-100 cursor-pointer" 
                    onClick={() => setAppState(AppState.DASHBOARD)}
                  />
                  <div className="flex flex-col leading-tight cursor-pointer" onClick={() => setAppState(AppState.DASHBOARD)}>
                    <span className="text-sm font-bold text-slate-800">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] uppercase tracking-wider text-brand-600 font-bold">My Library</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="ml-2 text-slate-400 hover:text-red-500 transition p-1.5 hover:bg-slate-100 rounded-full"
                    title="Log Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
                {/* Start Creating button for logged-in users */}
                <button 
                  onClick={() => setAppState(AppState.CONFIG)}
                  className="bg-slate-900 hover:bg-brand-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-brand-900/20 transition-all transform hover:scale-105 flex items-center space-x-2 text-sm"
                >
                  <span>Start Creating</span>
                  <Crown size={16} className="text-yellow-300" />
                </button>
              </>
            ) : (
               <div className="flex items-center space-x-3">
                  <button 
                     onClick={() => setAppState(AppState.LOGIN)}
                     className="text-slate-600 font-bold px-5 py-2.5 hover:bg-slate-100 rounded-full transition text-sm"
                  >
                     Log In
                  </button>
                  {/* Start Creating button removed for non-logged-in users */}
               </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-xl pt-28 px-6 animate-fade-in md:hidden">
          <div className="flex flex-col space-y-2">
            <NavItem label="Home" onClick={() => setAppState(AppState.LANDING)} mobile />
            <NavItem label="How it Works" onClick={() => setAppState(AppState.LANDING)} mobile />
            <NavItem label="Pricing" onClick={() => setAppState(AppState.PRICING)} mobile />
            
            <div className="pt-8 space-y-4">
              {user ? (
                 <>
                  <div className="flex items-center space-x-4 mb-4 bg-slate-50 p-4 rounded-2xl">
                    <img src={user.avatarUrl} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold text-xl">{user.name}</p>
                      <button onClick={() => setAppState(AppState.DASHBOARD)} className="text-brand-600 text-sm font-bold">Go to Dashboard</button>
                    </div>
                  </div>
                  {/* Create Story button for logged-in mobile users */}
                  <button 
                    onClick={() => { setAppState(AppState.CONFIG); setIsMenuOpen(false); }}
                    className="w-full bg-brand-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-200"
                  >
                    Create Story
                  </button>
                  <button 
                    onClick={() => { logout(); onLogout(); setIsMenuOpen(false); }}
                    className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl"
                  >
                    Log Out
                  </button>
                 </>
              ) : (
                <>
                  <button 
                    onClick={() => { setAppState(AppState.LOGIN); setIsMenuOpen(false); }}
                    className="w-full bg-white border-2 border-slate-200 text-slate-800 font-bold py-4 rounded-2xl"
                  >
                    Log In
                  </button>
                  {/* Create Story button removed for non-logged-in mobile users */}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;