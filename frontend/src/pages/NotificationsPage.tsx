import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Bell, RefreshCw, Trash2, AlertTriangle, Filter } from 'lucide-react';

const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const NotificationsPage: React.FC = () => {
  const { notifications, refreshData, loading, showToast } = useAppContext();
  const [filterDay, setFilterDay] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await api.generateNotifications();
      showToast('Notifications generated!', 'success');
      await refreshData();
    } catch (err) {
      showToast('Failed to generate notifications', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteNotification(id);
      showToast('Notification dismissed', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to dismiss notification', 'error');
    }
  };

  const filteredNotifications = filterDay === 'All'
    ? notifications
    : notifications.filter(n => n.dayOfWeek === filterDay);

  if (loading) return <div className="flex justify-center items-center h-64 text-indigo-600 font-bold italic">Loading Notifications...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 shadow-inner">
            <Bell size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Notifications
            </h2>
            <p className="text-gray-400 text-sm font-medium">Missing ingredients for your planned meals</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group flex-grow sm:flex-grow-0 min-w-[180px]">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="pl-12 pr-6 py-3 border border-gray-100 bg-gray-50 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none w-full shadow-sm transition-all appearance-none cursor-pointer"
            >
              {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-indigo-600 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none whitespace-nowrap"
          >
            <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'GENERATING...' : 'GENERATE UPDATES'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotifications.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell size={40} className="text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold text-lg">Your pantry seems ready!</p>
            <p className="text-gray-300 text-sm mt-2">No missing ingredients for the filtered selection.</p>
            <button 
              onClick={handleGenerate}
              className="mt-8 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-800 transition-colors"
            >
              Force Generate Now &rarr;
            </button>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group relative hover:shadow-xl hover:border-indigo-100 transition-all duration-300 animate-in zoom-in-95"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                  <AlertTriangle size={14} className="fill-yellow-500 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Action Required</span>
                </div>
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none">
                    {notif.dayOfWeek}
                  </h3>
                  <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">{notif.mealType}</span>
                </div>
                
                <div className="bg-red-50/50 p-4 rounded-xl border border-red-50">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Missing Ingredients</p>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {notif.missingIngredients}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-tighter">
                  <span>Logged {new Date(notif.createdAt).toLocaleDateString()}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                  <span>ID: {notif.id.substring(0, 8)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
