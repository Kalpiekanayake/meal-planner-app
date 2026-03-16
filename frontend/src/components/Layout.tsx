import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, Apple, Calendar, Bell, LogOut, ShoppingBag, LayoutDashboard, Menu, X, UserPlus, LogIn } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { notifications } = useAppContext();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Weekly Planner', path: '/planner', icon: <Calendar size={20} />, active: location.pathname === '/planner' },
    { name: 'Meals', path: '/meals', icon: <Utensils size={20} />, active: location.pathname === '/meals' },
    { name: 'Pantry', path: '/ingredients', icon: <Apple size={20} />, active: location.pathname === '/ingredients' },
    { name: 'Shopping List', path: '/shopping', icon: <ShoppingBag size={20} />, active: location.pathname === '/shopping' },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} />, active: location.pathname === '/notifications' },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      {/* Top Navigation Header */}
      <header className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 shadow-sm shadow-slate-200/40 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/crave-logo.png" 
              alt="Crave Logo" 
              className="w-9 h-9 object-contain"
            />
            <span className="text-2xl font-black tracking-tight text-slate-800">Crave</span>
          </Link>

          {/* Desktop Nav Links (for logged in users) */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    item.active
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-500 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/notifications" className="relative w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-600 transition-all border border-slate-50">
                  <Bell size={20} />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </Link>
                <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
                <div className="flex items-center gap-3 pl-1">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-black text-slate-800 truncate max-w-[120px]">{user.name}</p>
                    <button onClick={logout} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Sign Out</button>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary-100 border border-primary-400">
                    {getInitials(user.name)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black text-slate-800 hover:bg-slate-50 transition-all"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-full text-sm font-black shadow-lg shadow-primary-100 hover:bg-primary-600 transition-all active:scale-95"
                >
                  <UserPlus size={18} />
                  Join Free
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300">
          <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-black text-slate-800">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                <X size={24} />
              </button>
            </div>
            
            <nav className="space-y-2 flex-grow">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                  location.pathname === '/' ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard size={20} />
                Home
              </Link>
              
              {user && navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                    item.active ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl"
                  >
                    <LogIn size={20} />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-4 bg-primary-500 text-white font-bold rounded-2xl shadow-lg shadow-primary-100"
                  >
                    <UserPlus size={20} />
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold">
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold rounded-2xl"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 animate-in fade-in duration-700">
          {children}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img 
              src="/crave-logo.png" 
              alt="Crave Logo" 
              className="w-6 h-6 object-contain"
            />
            <span className="font-black text-slate-800">Crave</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 Crave Meal Planner. Built for busy kitchens.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-primary-500 text-xs font-bold uppercase tracking-widest transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-primary-500 text-xs font-bold uppercase tracking-widest transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
