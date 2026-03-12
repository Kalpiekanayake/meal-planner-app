import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Calendar, Trash2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

const WeeklyPlannerPage: React.FC = () => {
  const { meals, planner, refreshData, loading, showToast } = useAppContext();
  const [day, setDay] = useState('Monday');
  const [mealType, setMealType] = useState('Lunch');
  const [mealId, setMealId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealId) return;
    setIsSubmitting(true);
    try {
      await api.createPlannerEntry(day, mealType, mealId);
      showToast('Added to planner', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to add entry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await api.deletePlannerEntry(id);
      showToast('Entry removed', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to remove entry', 'error');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-indigo-600 font-bold">Loading Planner...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <Calendar size={24} className="text-indigo-600" /> Quick Add to Planner
        </h2>
        <form onSubmit={handleCreateEntry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Day of Week</label>
            <select 
              value={day} 
              onChange={(e) => setDay(e.target.value)} 
              className="w-full border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none border"
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Meal Type</label>
            <select 
              value={mealType} 
              onChange={(e) => setMealType(e.target.value)} 
              className="w-full border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none border"
            >
              {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Select Meal</label>
            <select 
              value={mealId} 
              onChange={(e) => setMealId(e.target.value)} 
              className="w-full border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none border"
            >
              <option value="">Choose a meal...</option>
              {meals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting || !mealId}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 border-b border-gray-100 hidden md:grid">
          {DAYS.map(d => (
            <div key={d} className="p-4 text-center border-r last:border-r-0 border-gray-100">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{d.substring(0, 3)}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-7 min-h-[600px]">
          {DAYS.map(d => (
            <div key={d} className="border-r last:border-r-0 border-gray-100 flex flex-col group hover:bg-indigo-50/20 transition-colors">
              <div className="md:hidden bg-indigo-600 text-white p-2 font-bold text-center uppercase text-xs">
                {d}
              </div>
              <div className="p-2 flex-grow space-y-4">
                {MEAL_TYPES.map(type => (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{type}</h4>
                    </div>
                    <div className="space-y-2 min-h-[40px]">
                      {planner
                        .filter(entry => entry.dayOfWeek === d && entry.mealType === type)
                        .map(entry => (
                          <div key={entry.id} className="bg-white border border-indigo-100 p-2.5 rounded-xl shadow-sm relative group/item hover:border-indigo-300 transition-all transform hover:-translate-y-0.5">
                            <p className="text-xs font-bold text-gray-800 leading-tight pr-4">{entry.meal?.name}</p>
                            <button 
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      {planner.filter(entry => entry.dayOfWeek === d && entry.mealType === type).length === 0 && (
                        <div className="border border-dashed border-gray-100 rounded-xl p-3 flex items-center justify-center">
                          <span className="text-[9px] text-gray-300 font-medium italic">Unplanned</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlannerPage;
