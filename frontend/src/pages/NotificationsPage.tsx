import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { RefreshCw, Trash2, AlertTriangle, CheckCircle2, ShoppingCart, Calendar, Clock, Eye, ShoppingBag, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const NotificationsPage: React.FC = () => {
  const { notifications, refreshData, loading, showToast, requireAuth } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const handleGenerate = async () => {
    requireAuth(async () => {
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
    });
  };

  const handleMarkAsRead = async (id: string) => {
    requireAuth(async () => {
      try {
        await api.markNotificationAsRead(id);
        refreshData();
      } catch (err) {
        showToast('Failed to update notification', 'error');
      }
    });
  };

  const handleDelete = async (id: string) => {
    requireAuth(async () => {
      try {
        await api.deleteNotification(id);
        showToast('Notification cleared', 'success');
        refreshData();
      } catch (err) {
        showToast('Failed to dismiss notification', 'error');
      }
    });
  };

  const filteredNotifications = filterType === 'all'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  if (loading && notifications.length === 0) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Checking alerts...</p>
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

  const getVariant = (type: string): 'primary' | 'warning' | 'danger' | 'neutral' => {
    switch (type) {
      case 'shopping': return 'primary';
      case 'missing_ingredient': return 'warning';
      case 'forgotten_item': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">       
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Notifications</h1>
          <p className="text-slate-500 font-medium mt-1">
            You have <span className="text-primary-600 font-bold">{notifications.filter(n => !n.isRead).length} unread</span> alerts.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Input
            isSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { label: 'All Alerts', value: 'all' },
              { label: 'Shopping', value: 'shopping' },
              { label: 'Missing Items', value: 'missing_ingredient' },
              { label: 'Forgotten', value: 'forgotten_item' },
            ]}
            className="sm:w-64"
          />
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            icon={<RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />}
            size="lg"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredNotifications.length === 0 ? (
          <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">All caught up!</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">No new notifications at the moment.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-8 flex flex-col justify-between group ${
                notif.isRead ? 'opacity-60 grayscale' : 'border-primary-100 ring-4 ring-primary-50/30'
              }`}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 
                    ${notif.isRead ? 'bg-slate-100 text-slate-400 shadow-none' : 
                      notif.type === 'shopping' ? 'bg-blue-500 text-white shadow-blue-100' :
                      notif.type === 'missing_ingredient' ? 'bg-amber-500 text-white shadow-amber-100' :
                      notif.type === 'forgotten_item' ? 'bg-red-500 text-white shadow-red-100' :
                      'bg-primary-500 text-white shadow-primary-100'
                    }`}
                  >
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex gap-2">
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="w-10 h-10 rounded-full bg-slate-50 text-primary-500 hover:bg-primary-50 transition-all flex items-center justify-center"
                        title="Mark as read"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center"
                      title="Clear"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge variant={getVariant(notif.type)} className="text-[9px]">
                    {notif.type.replace('_', ' ')}
                  </Badge>
                  <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tight">
                    {notif.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm">
                    {notif.message}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">      
                <div className="flex items-center gap-2 text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                  <Calendar size={12} />
                  <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                  <Clock size={12} />
                  <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
