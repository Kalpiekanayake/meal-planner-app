import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Calendar, Trash2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

const WeeklyPlannerPage: React.FC = () => {
  const { meals, planner, refreshData, loading } = useAppContext();
  const [day, setDay] = useState('Monday');
  const [mealType, setMealType] = useState('Lunch');
  const [mealId, setMealId] = useState('');

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealId) return;
    try {
      await api.createPlannerEntry(day, mealType, mealId);
      refreshData();
    } catch (err) {
      alert('Failed to add planner entry');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await api.deletePlannerEntry(id);
      refreshData();
    } catch (err) {
      alert('Failed to delete planner entry');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={24} /> Add to Planner
        </h2>
        <form onSubmit={handleCreateEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Day</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full border rounded-md p-2 mt-1">
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meal Type</label>
            <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="w-full border rounded-md p-2 mt-1">
              {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meal</label>
            <select value={mealId} onChange={(e) => setMealId(e.target.value)} className="w-full border rounded-md p-2 mt-1">
              <option value="">Select a meal...</option>
              {meals.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700 h-[42px]"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {DAYS.map(d => (
          <div key={d} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col min-h-[300px]">
            <div className="bg-indigo-600 text-white p-2 text-center font-bold text-sm uppercase">
              {d}
            </div>
            <div className="p-3 flex-grow space-y-4">
              {MEAL_TYPES.map(type => (
                <div key={type} className="space-y-1">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{type}</h4>
                  {planner
                    .filter(entry => entry.dayOfWeek === d && entry.mealType === type)
                    .map(entry => (
                      <div key={entry.id} className="bg-indigo-50 border border-indigo-100 p-2 rounded relative group">
                        <p className="text-xs font-bold text-indigo-900 truncate pr-4">{entry.meal?.name}</p>
                        <button 
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="absolute top-1 right-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  {planner.filter(entry => entry.dayOfWeek === d && entry.mealType === type).length === 0 && (
                    <div className="border border-dashed border-gray-200 rounded p-2">
                      <p className="text-[10px] text-gray-300 italic text-center">Empty</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlannerPage;
