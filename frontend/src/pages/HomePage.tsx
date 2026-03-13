import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Utensils, Apple, ShoppingBag, Bell, ChevronRight, Star, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Weekly Planner',
      desc: 'Organize your meals for the entire week in minutes.',
      icon: <Calendar className="text-teal-500" size={32} />,
      path: '/planner',
      color: 'bg-teal-50'
    },
    {
      title: 'Meals Library',
      desc: 'Keep all your favorite recipes and meal ideas in one place.',
      icon: <Utensils className="text-indigo-500" size={32} />,
      path: '/meals',
      color: 'bg-indigo-50'
    },
    {
      title: 'Pantry Manager',
      desc: 'Track what ingredients you have and what you need to buy.',
      icon: <Apple className="text-amber-500" size={32} />,
      path: '/ingredients',
      color: 'bg-amber-50'
    },
    {
      title: 'Shopping List',
      desc: 'Automated shopping lists based on your weekly meal plan.',
      icon: <ShoppingBag className="text-emerald-500" size={32} />,
      path: '/shopping',
      color: 'bg-emerald-50'
    },
    {
      title: 'Smart Alerts',
      desc: 'Get reminders for missing items and upcoming planned meals.',
      icon: <Bell className="text-rose-500" size={32} />,
      path: '/notifications',
      color: 'bg-rose-50'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-black uppercase tracking-widest animate-bounce">
              <Star size={14} fill="currentColor" />
              <span>Smart Meal Planning</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-800 tracking-tight leading-[1.1]">
              Plan meals, <br />
              <span className="text-teal-500 text-glow-teal">shop smarter.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              Crave helps you plan meals, track pantry ingredients, and automatically create your shopping list.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              {user ? (
                <Link
                  to="/planner"
                  className="px-10 py-5 bg-teal-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-teal-200 hover:bg-teal-600 transition-all active:scale-95 flex items-center gap-3"
                >
                  Start Planning <ChevronRight size={24} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-10 py-5 bg-teal-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-teal-200 hover:bg-teal-600 transition-all active:scale-95 flex items-center gap-3"
                  >
                    Start Planning Free <ChevronRight size={24} />
                  </Link>
                  <Link
                    to="/login"
                    className="px-10 py-5 bg-white text-slate-700 border border-slate-100 rounded-[2rem] font-black text-lg shadow-xl shadow-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-teal-100 rounded-full blur-[100px] opacity-50 -z-10"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50 -z-10"></div>
            
            <div className="grid grid-cols-2 gap-4 p-4 animate-in fade-in zoom-in duration-1000">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 transform hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500 mb-4">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-1">Meals Planned</h3>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">See how many meals are scheduled this week</p>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 transform hover:-translate-y-2 transition-transform duration-500 delay-100">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
                    <Bell size={24} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-1">Notifications</h3>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Important alerts about missing ingredients</p>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 transform hover:-translate-y-2 transition-transform duration-500 delay-200">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
                    <Apple size={24} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-1">Pantry Items</h3>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Ingredients currently tracked in your pantry</p>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 transform hover:-translate-y-2 transition-transform duration-500 delay-300">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-1">Items to Buy</h3>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">Ingredients waiting in your shopping list</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Everything you need</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Powerful tools designed to make your daily routine effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <Link 
              to={feature.path} 
              key={i} 
              className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 hover:shadow-2xl hover:shadow-teal-100/50 hover:border-teal-100 transition-all duration-500 group flex flex-col items-center text-center"
            >
              <div className={`w-20 h-20 ${feature.color} rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {feature.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-900 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden text-center lg:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]"></div>
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Ready to take control <br />of your kitchen?
            </h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              Join thousands of people who have simplified their lives with Crave. It's time to eat better and save money.
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-3 text-white font-bold">
                <Zap className="text-teal-400" size={24} />
                <span>Fast & Simple</span>
              </div>
              <div className="flex items-center gap-3 text-white font-bold">
                <Shield className="text-teal-400" size={24} />
                <span>Private Data</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 flex justify-center lg:justify-end">
            <Link
              to={user ? "/planner" : "/register"}
              className="px-12 py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-teal-50 transition-all active:scale-95 whitespace-nowrap"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
