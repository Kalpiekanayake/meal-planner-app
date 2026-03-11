import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, Apple, Calendar, Bell } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Meals', path: '/', icon: <Utensils size={20} /> },
    { name: 'Ingredients', path: '/ingredients', icon: <Apple size={20} /> },
    { name: 'Weekly Planner', path: '/planner', icon: <Calendar size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold flex items-center gap-2">
                <Utensils /> Meal Planner
              </span>
            </div>
            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-100 hover:bg-indigo-500'
                  }`}
                >
                  {item.icon} {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Meal Planner App
      </footer>
    </div>
  );
};

export default Layout;
