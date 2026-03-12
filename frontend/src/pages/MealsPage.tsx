import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Plus, Trash2, Link as LinkIcon, Utensils, Clock, User, ChevronRight, X, Search, Info } from 'lucide-react';

const MealsPage: React.FC = () => {
  const { meals, ingredients, refreshData, loading, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await api.createMeal(name);
      setName('');
      setShowForm(false);
      showToast('Meal created successfully!', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to create meal', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    try {
      await api.deleteMeal(id);
      showToast('Meal deleted', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to delete meal', 'error');
    }
  };

  const handleLinkIngredient = async () => {
    if (!selectedMealId || !selectedIngredientId) return;
    try {
      await api.linkIngredientToMeal(selectedMealId, selectedIngredientId);
      showToast('Ingredient linked!', 'success');
      setSelectedIngredientId('');
      setSelectedMealId(null);
      refreshData();
    } catch (err) {
      showToast('Failed to link ingredient', 'error');
    }
  };

  const filteredMeals = meals.filter(meal => 
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Meals...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Meals Library</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your favorite meals and their required ingredients.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
            showForm 
              ? 'bg-slate-800 text-white hover:bg-black shadow-slate-100' 
              : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
          }`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Close Form' : 'Add New Meal'}
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <input 
          type="text" 
          placeholder="Search your meals..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800">
            <Utensils size={24} className="text-indigo-600" /> Meal Details
          </h2>
          <form onSubmit={handleCreateMeal} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Meal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all p-4 border outline-none font-bold text-lg placeholder:text-slate-300"
                placeholder="e.g. Spaghetti Carbonara"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !name}
                className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-100 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Meal'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div 
            key={meal.id} 
            className="group bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <Utensils size={28} />
              </div>
              <button
                onClick={() => handleDeleteMeal(meal.id)}
                className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
              {meal.name}
            </h3>
            
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Info size={12} className="text-indigo-400" />
                <span>Ingredients Needed:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {meal.ingredients?.map((ing) => (
                  <span 
                    key={ing.id} 
                    className={`text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-tighter ${
                      ing.isAvailable 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}
                  >
                    {ing.name}
                  </span>
                ))}
                {(!meal.ingredients || meal.ingredients.length === 0) && (
                  <div className="w-full py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-100 flex items-center justify-center">
                    <span className="text-slate-300 text-[10px] font-bold italic uppercase tracking-widest">No ingredients linked</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedMealId(meal.id)}
              className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white rounded-2xl py-4 transition-all duration-300 group/btn"
            >
              <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" /> 
              Link Ingredients
            </button>
          </div>
        ))}
        
        {filteredMeals.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
            <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Utensils size={48} />
            </div>
            <p className="text-slate-400 font-black text-2xl tracking-tight">No meals found</p>
            <p className="text-slate-300 font-medium mt-2">Try searching for something else or add a new meal.</p>
          </div>
        )}
      </div>

      {/* Modern Link Ingredient Modal */}
      {selectedMealId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <h3 className="text-3xl font-black mb-1 text-slate-800 tracking-tight">Add Ingredient</h3>
            <p className="text-slate-400 text-sm font-medium mb-8">Linking to: <span className="text-indigo-600 font-bold">{meals.find(m => m.id === selectedMealId)?.name}</span></p>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Ingredient</label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose from library...</option>
                  {ingredients
                    .filter(ing => !meals.find(m => m.id === selectedMealId)?.ingredients?.find(mi => mi.id === ing.id))
                    .map((ing) => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleLinkIngredient}
                  disabled={!selectedIngredientId}
                  className="flex-[2] bg-indigo-600 text-white rounded-2xl py-4 font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  Confirm Link
                </button>
                <button
                  onClick={() => setSelectedMealId(null)}
                  className="flex-1 bg-slate-100 text-slate-500 rounded-2xl py-4 font-black hover:bg-slate-200 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsPage;
