import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, Apple, Calendar, Bell, Menu, X, ChevronRight, LayoutDashboard, Settings, LogOut, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { notifications } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, active: location.pathname === '/' },
    { name: 'Weekly Planner', path: '/planner', icon: <Calendar size={20} />, active: location.pathname === '/planner' },
    { name: 'Meals', path: '/meals', icon: <Utensils size={20} />, active: location.pathname === '/meals' },
    { name: 'Ingredients', path: '/ingredients', icon: <Apple size={20} />, active: location.pathname === '/ingredients' },
    { name: 'Shopping List', path: '/shopping', icon: <Search size={20} />, active: location.pathname === '/shopping' },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} />, active: location.pathname === '/notifications', badge: notifications.length },
  ];

  const NavLink = ({ item, isMobile = false }: { item: any, isMobile?: boolean }) => (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
        item.active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
          : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <div className={`${item.active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'} transition-transform duration-300`}>
        {item.icon}
      </div>
      {(isSidebarOpen || isMobile) && (
        <span className="flex-grow font-semibold tracking-tight">{item.name}</span>
      )}
      {item.badge > 0 && (isSidebarOpen || isMobile) && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.active ? 'bg-white text-indigo-600' : 'bg-red-500 text-white animate-pulse'}`}>
          {item.badge}
        </span>
      )}
      {item.active && (isSidebarOpen || isMobile) && (
        <ChevronRight size={14} className="opacity-50" />
      )}
      {!isSidebarOpen && !isMobile && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {item.name}
        </div>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out fixed inset-y-0 z-30`}
      >
        <div className="h-20 px-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                <Utensils size={24} />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-800">Crave</span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 mx-auto">
              <Utensils size={24} />
            </div>
          )}
        </div>

        <div className="flex-grow px-4 mt-4 space-y-1">
          <p className={`px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${!isSidebarOpen && 'text-center'}`}>
            {isSidebarOpen ? 'Menu' : '•••'}
          </p>
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
          
          <div className="pt-8 space-y-1">
            <p className={`px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${!isSidebarOpen && 'text-center'}`}>
              {isSidebarOpen ? 'Preferences' : '•••'}
            </p>
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-slate-50 transition-all ${!isSidebarOpen && 'justify-center'}`}>
              <Settings size={20} />
              {isSidebarOpen && <span>Settings</span>}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className={`flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
              JD
            </div>
            {isSidebarOpen && (
              <div className="flex-grow min-w-0">
                <p className="text-sm font-bold truncate">John Doe</p>
                <p className="text-[10px] text-slate-400 truncate font-medium">Pro Member</p>
              </div>
            )}
            {isSidebarOpen && <LogOut size={16} className="text-slate-300 group-hover:text-red-500 transition-colors" />}
          </div>
        </div>

        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm z-40 transition-colors"
        >
          {isSidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>
      </aside>

      {/* Mobile Top Nav */}
      <header className="md:hidden fixed top-0 inset-x-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Utensils size={18} />
          </div>
          <span className="font-black text-lg">Crave</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 md:hidden">
          <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="font-black text-xl">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2 flex-grow">
              {navItems.map((item) => (
                <NavLink key={item.path} item={item} isMobile />
              ))}
            </nav>
            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">JD</div>
                <div>
                  <p className="text-sm font-bold">John Doe</p>
                  <p className="text-xs text-slate-500 font-medium">j.doe@example.com</p>
                </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {navItems.find(item => item.active)?.name || 'Dashboard'}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Welcome back, John 👋
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search meals..." 
                className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 w-64 outline-none transition-all"
              />
            </div>
            
            <button className="relative w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <Bell size={20} />
              {notifications.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            
            <div className="w-[1px] h-8 bg-slate-200"></div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600 hidden xl:inline">Premium Plan</span>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-tighter ring-1 ring-green-200">
                Active
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow p-4 md:p-8 pt-20 md:pt-8 bg-slate-50">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
