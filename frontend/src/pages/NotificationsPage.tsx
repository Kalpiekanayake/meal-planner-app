import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Bell, RefreshCw, Trash2, AlertTriangle, Filter } from 'lucide-react';

const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const NotificationsPage: React.FC = () => {
  const { notifications, refreshData, loading } = useAppContext();
  const [filterDay, setFilterDay] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await api.generateNotifications();
      await refreshData();
    } catch (err) {
      alert('Failed to generate notifications');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteNotification(id);
      refreshData();
    } catch (err) {
      alert('Failed to delete notification');
    }
  };

  const filteredNotifications = filterDay === 'All'
    ? notifications
    : notifications.filter(n => n.dayOfWeek === filterDay);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-md gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell size={24} /> Notifications
          </h2>
          <p className="text-gray-500 text-sm">Missing ingredients for your planned meals</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Filter size={16} className="absolute left-3 top-3 text-gray-400" />
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
            >
              {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
            Generate
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 italic">No missing ingredient notifications found</p>
            <p className="text-gray-400 text-xs mt-2">Try clicking "Generate" to refresh</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div key={notif.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 flex justify-between items-center animate-in slide-in-from-top duration-300">
              <div className="flex gap-4 items-start">
                <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 mt-1">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {notif.dayOfWeek} - {notif.mealType}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Missing: <span className="font-medium text-red-600">{notif.missingIngredients}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase">
                    Generated on {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(notif.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
