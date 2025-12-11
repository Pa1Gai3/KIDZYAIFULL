
import React from 'react';
import { AppState } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
  setAppState: (state: AppState) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, setAppState }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 md:py-12 mt-8 md:mt-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12">

        {/* Brand Section - Spans full width on mobile top */}
        <div className="md:w-1/4">
          <h4 className="text-white font-display font-bold text-xl mb-3 md:mb-4">KidzyColor</h4>
          <p className="text-sm leading-relaxed max-w-xs">
            Making every child the hero of their own imagination through the power of AI.
          </p>
        </div>

        {/* Links Sections - 3 Columns on Mobile (Horizontal Stacking) */}
        <div className="md:w-3/4 grid grid-cols-3 gap-2 md:gap-8 text-left">

          {/* Product Column */}
          <div>
            <h5 className="text-white font-bold mb-3 text-sm md:text-base">Product</h5>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <button onClick={() => setAppState(AppState.LANDING)} className="hover:text-white transition text-left">Features</button>
              </li>
              <li>
                <button onClick={() => setAppState(AppState.PRICING)} className="hover:text-white transition text-left">Pricing</button>
              </li>
              <li>
                <button onClick={() => onNavigate('schools')} className="hover:text-white transition text-left">For Schools</button>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h5 className="text-white font-bold mb-3 text-sm md:text-base">Support</h5>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <button onClick={() => onNavigate('help')} className="hover:text-white transition text-left">Help Center</button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition text-left">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition text-left">Terms of Service</button>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h5 className="text-white font-bold mb-3 text-sm md:text-base">Connect</h5>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition block">Instagram</a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition block">Twitter</a>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition text-left">Contact Us</button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 md:mt-12 pt-8 border-t border-slate-800 text-center text-[10px] md:text-xs opacity-60">
        &copy; {new Date().getFullYear()} KidzyColor AI. All rights reserved by Wayne Creative Alliance Pvt Ltd.
      </div>
    </footer>
  );
};

export default Footer;
