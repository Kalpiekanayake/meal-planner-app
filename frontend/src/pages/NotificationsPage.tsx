import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Bell, RefreshCw, Trash2, AlertTriangle, Filter, CheckCircle2, ShoppingCart, Calendar, Clock, Eye, ShoppingBag, Info } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { notifications, refreshData, loading, showToast } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await api.generateNotifications();
      showToast('Notifications updated!', 'success');
      await refreshData();
    } catch (err) {
      showToast('Failed to check for updates', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      refreshData();
    } catch (err) {
      showToast('Failed to update notification', 'error');
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

  const filteredNotifications = filterType === 'all'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Notifications...</p>
    </div>
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'shopping': return <ShoppingCart size={24} />;
      case 'missing_ingredient': return <AlertTriangle size={24} />;
      case 'forgotten_item': return <ShoppingBag size={24} />;
      default: return <Info size={24} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'shopping': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'missing_ingredient': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'forgotten_item': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -z-10 opacity-30"></div>
        
        <div className="flex items-center gap-6">
          <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <Bell size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Notifications</h1>
            <p className="text-slate-500 font-medium mt-1">You have <span className="text-indigo-600 font-bold">{notifications.filter(n => !n.isRead).length} unread</span> alerts.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-6 pr-10 py-4 bg-slate-50 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm transition-all cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="shopping">Shopping</option>
            <option value="missing_ingredient">Missing Ingredients</option>
            <option value="forgotten_item">Forgotten Items</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'Refreshing...' : 'Refresh Alerts'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotifications.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-green-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">No notifications</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-sm mx-auto">Everything looks good! No alerts to show at the moment.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`bg-white p-7 rounded-[2rem] shadow-sm border group relative hover:shadow-2xl hover:shadow-indigo-50/50 transition-all duration-500 animate-in zoom-in-95 ${
                notif.isRead ? 'opacity-60 grayscale border-slate-100' : 'border-indigo-100 ring-2 ring-indigo-50/50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getColor(notif.type)}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">{notif.type.replace('_', ' ')}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Mark as read"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                      {notif.title}
                    </h3>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    notif.isRead ? 'bg-slate-50 text-slate-300' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  }`}>
                    {getIcon(notif.type)}
                  </div>
                </div>
                
                <p className="text-slate-600 font-medium leading-relaxed text-sm">
                  {notif.message}
                </p>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                    <Calendar size={12} />
                    <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                    <Clock size={12} />
                    <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
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
