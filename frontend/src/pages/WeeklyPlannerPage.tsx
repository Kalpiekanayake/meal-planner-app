import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Calendar, Trash2, Plus, ChevronLeft, ChevronRight, Utensils, Info } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

const WeeklyPlannerPage: React.FC = () => {
  const { meals, planner, refreshData, loading, showToast } = useAppContext();
  const [day, setDay] = useState('Monday');
  const [mealType, setMealType] = useState('Lunch');
  const [mealId, setMealId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealId) return;
    setIsSubmitting(true);
    try {
      await api.createPlannerEntry(day, mealType, mealId);
      showToast('Added to your schedule!', 'success');
      setMealId('');
      setShowQuickAdd(false);
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
      showToast('Entry removed from schedule', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to remove entry', 'error');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Schedule...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Weekly Planner</h1>
          <p className="text-slate-500 font-medium">Schedule your meals and stay organized.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"><ChevronLeft size={20} /></button>
            <div className="px-4 flex items-center font-bold text-sm text-slate-700">Next 7 Days</div>
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"><ChevronRight size={20} /></button>
          </div>
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={20} /> Quick Plan
          </button>
        </div>
      </div>

      {showQuickAdd && (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800">
            <Calendar size={24} className="text-indigo-600" /> Schedule a Meal
          </h2>
          <form onSubmit={handleCreateEntry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Day</label>
              <select 
                value={day} 
                onChange={(e) => setDay(e.target.value)} 
                className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meal Time</label>
              <select 
                value={mealType} 
                onChange={(e) => setMealType(e.target.value)} 
                className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipe</label>
              <select 
                value={mealId} 
                onChange={(e) => setMealId(e.target.value)} 
                className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Choose a recipe...</option>
                {meals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting || !mealId}
                className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add to Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modern Calendar Grid */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10 hidden md:grid">
          {DAYS.map(d => (
            <div key={d} className="p-6 text-center border-r last:border-r-0 border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{d.substring(0, 3)}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-7 min-h-[700px]">
          {DAYS.map(d => (
            <div key={d} className="border-r last:border-r-0 border-slate-100 flex flex-col group/day hover:bg-slate-50/30 transition-colors">
              <div className="md:hidden bg-indigo-600 text-white p-4 font-black text-center uppercase text-xs tracking-widest">
                {d}
              </div>
              
              <div className="p-3 flex-grow space-y-6">
                {MEAL_TYPES.map(type => (
                  <div key={type} className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{type}</h4>
                      <Plus size={10} className="text-slate-200 opacity-0 group-hover/day:opacity-100 cursor-pointer hover:text-indigo-500 transition-all" onClick={() => { setDay(d); setMealType(type); setShowQuickAdd(true); }} />
                    </div>
                    
                    <div className="space-y-2 min-h-[60px]">
                      {planner
                        .filter(entry => entry.dayOfWeek === d && entry.mealType === type)
                        .map(entry => (
                          <div 
                            key={entry.id} 
                            className="bg-white border border-slate-100 p-3.5 rounded-2xl shadow-sm relative group/item hover:border-indigo-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <div className="flex flex-col gap-1 pr-4">
                              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Planned</span>
                              <p className="text-xs font-black text-slate-700 leading-tight tracking-tight">{entry.meal?.name}</p>
                            </div>
                            
                            <button 
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="absolute top-2 right-2 p-1.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                            
                            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase">
                               <Utensils size={10} /> 
                               <span>Recipe Info</span>
                            </div>
                          </div>
                        ))}
                      
                      {planner.filter(entry => entry.dayOfWeek === d && entry.mealType === type).length === 0 && (
                        <div className="border-2 border-dashed border-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 hover:bg-slate-50/50 hover:border-indigo-100 transition-all cursor-pointer group/add">
                           <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover/add:bg-indigo-50 group-hover/add:text-indigo-400 transition-colors">
                              <Plus size={12} />
                           </div>
                           <span className="text-[8px] text-slate-300 font-black uppercase tracking-widest">Unplanned</span>
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

      <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 flex items-start gap-4">
        <div className="bg-indigo-600 text-white p-2 rounded-xl">
          <Info size={20} />
        </div>
        <div>
          <h4 className="text-indigo-900 font-black text-sm uppercase tracking-tight">Pro Tip</h4>
          <p className="text-indigo-700/70 text-sm font-medium mt-1 leading-relaxed">
            Scheduling your meals in advance helps you automatically generate shopping lists and notifications for missing ingredients. 
            Check the <span className="font-bold">Notifications</span> tab to see what you need to buy!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlannerPage;
