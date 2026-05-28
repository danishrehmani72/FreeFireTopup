import { Gamepad2, Search, ShoppingCart, User, Menu, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { logout } from '../services/authService';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, userProfile, logoutGuest } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-logout legacy Google users
  useEffect(() => {
    if (userProfile?.email && userProfile.email.includes('@')) {
      logout();
      logoutGuest();
    }
  }, [userProfile, logoutGuest]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-dark/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Menu className="h-6 w-6 text-gray-400 sm:hidden" />
            <div className="flex items-center gap-2 group cursor-pointer">
              <Gamepad2 className="h-8 w-8 text-brand-primary transition-transform group-hover:scale-110 group-hover:text-brand-secondary" />
              <span className="font-display text-2xl font-bold uppercase tracking-wider text-white">
                NEXUS<span className="text-brand-primary">TOPUP</span>
              </span>
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-center sm:flex">
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border border-brand-border bg-brand-card/50 py-2 pl-10 pr-3 text-sm text-gray-200 placeholder-gray-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder="Search games, gift cards..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <button className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-brand-card hover:text-white">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary"></span>
              </span>
            </button>
            
            {(user || userProfile) && (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-md bg-brand-card px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-card/80 border border-brand-primary/50"
                >
                  <span className="hidden sm:inline-block font-mono text-brand-primary">
                    {userProfile?.balance || 0} 💎
                  </span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md border border-brand-border bg-brand-card shadow-lg py-1">
                    <div className="px-4 py-3 border-b border-brand-border">
                      <p className="text-xs text-brand-primary font-bold">Free Fire ID:</p>
                      <p className="text-sm text-white truncate font-mono mt-1">{userProfile?.email}</p>
                    </div>
                    <button 
                      onClick={() => { 
                        logout(); 
                        logoutGuest();
                        setShowDropdown(false); 
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-brand-dark/50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
