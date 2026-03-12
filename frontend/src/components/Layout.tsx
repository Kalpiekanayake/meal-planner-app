import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, Apple, Calendar, Bell, Menu, X, ChevronRight } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Meals', path: '/', icon: <Utensils size={20} /> },
    { name: 'Ingredients', path: '/ingredients', icon: <Apple size={20} /> },
    { name: 'Weekly Planner', path: '/planner', icon: <Calendar size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-indigo-800 text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          {isSidebarOpen && (
            <span className="text-xl font-bold flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <Utensils className="flex-shrink-0" /> Meal Planner
            </span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-indigo-700 rounded-md transition-colors mx-auto"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="flex-grow mt-6 px-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                location.pathname === item.path
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-indigo-100 hover:bg-indigo-700 hover:pl-4'
              }`}
            >
              <div className={`${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </div>
              {isSidebarOpen && (
                <span className="flex-grow">{item.name}</span>
              )}
              {isSidebarOpen && location.pathname === item.path && (
                <ChevronRight size={16} />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-700">
          {isSidebarOpen ? (
            <div className="text-xs text-indigo-300 text-center">
              &copy; {new Date().getFullYear()} Meal Planner App
            </div>
          ) : (
            <div className="text-center font-bold">MP</div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-white border-b h-16 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>

        <main className="flex-grow p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
