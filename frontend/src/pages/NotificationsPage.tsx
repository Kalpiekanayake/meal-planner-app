import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Bell, RefreshCw, Trash2, AlertTriangle, Filter, CheckCircle2, ShoppingCart, Calendar, Clock } from 'lucide-react';

const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const NotificationsPage: React.FC = () => {
  const { notifications, refreshData, loading, showToast } = useAppContext();
  const [filterDay, setFilterDay] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await api.generateNotifications();
      showToast('Inventory check complete!', 'success');
      await refreshData();
    } catch (err) {
      showToast('Failed to check inventory', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteNotification(id);
      showToast('Notification cleared', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to dismiss notification', 'error');
    }
  };

  const filteredNotifications = filterDay === 'All'
    ? notifications
    : notifications.filter(n => n.dayOfWeek === filterDay);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Checking Pantry...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -z-10 opacity-30"></div>
        
        <div className="flex items-center gap-6">
          <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <Bell size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pantry Alerts</h1>
            <p className="text-slate-500 font-medium mt-1">We found <span className="text-indigo-600 font-bold">{notifications.length} items</span> missing for your planned meals.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group flex-grow sm:flex-grow-0 min-w-[200px]">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none shadow-sm transition-all appearance-none cursor-pointer"
            >
              {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'Checking...' : 'Check Inventory'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotifications.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-green-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">You're all set!</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-sm mx-auto">No missing ingredients found for the selected period. Your pantry matches your schedule.</p>
            <button 
              onClick={handleGenerate}
              className="mt-8 px-6 py-3 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              Run Check Again
            </button>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 group relative hover:shadow-2xl hover:shadow-indigo-50/50 hover:border-indigo-100 transition-all duration-500 animate-in zoom-in-95"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                  <AlertTriangle size={14} className="fill-amber-500 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Shopping Required</span>
                </div>
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                      {notif.dayOfWeek}
                    </h3>
                    <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mt-2">{notif.mealType}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <ShoppingCart size={24} />
                  </div>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:border-indigo-50 transition-colors duration-500">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Missing Ingredients</p>
                  <p className="text-slate-700 font-bold leading-relaxed text-sm">
                    {notif.missingIngredients}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                    <Calendar size={12} />
                    <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                    <Clock size={12} />
                    <span>ID: {notif.id.substring(0, 6)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] -z-10 opacity-20"></div>
          <div className="max-w-2xl">
            <h4 className="text-2xl font-black tracking-tight mb-4">Ready to go shopping?</h4>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              We've identified all the missing pieces for your weekly plan. You can export this list to your favorite grocery app or just use this dashboard while you're at the store.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-50 transition-all active:scale-95">
                Print Shopping List
              </button>
              <button className="px-8 py-4 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-700 transition-all active:scale-95">
                Share List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
