import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Plus, Trash2, Link as LinkIcon, Utensils, Clock, User, ChevronRight, X } from 'lucide-react';

const MealsPage: React.FC = () => {
  const { meals, ingredients, refreshData, loading, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleCreateMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await api.createMeal(name, description);
      setName('');
      setDescription('');
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Meals...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Your Meals</h1>
          <p className="text-slate-500 font-medium">Manage your recipe collection and ingredients.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            showForm 
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'Create New Meal'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800">
            <Utensils size={24} className="text-indigo-600" /> New Recipe Details
          </h2>
          <form onSubmit={handleCreateMeal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Meal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all p-4 border outline-none font-medium placeholder:text-slate-300"
                placeholder="e.g. Avocado Toast with Poached Egg"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all p-4 border outline-none font-medium placeholder:text-slate-300"
                placeholder="Brief description of the meal..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Save Recipe'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div 
            key={meal.id} 
            className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <Utensils size={24} />
                </div>
                <button
                  onClick={() => handleDeleteMeal(meal.id)}
                  className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                {meal.name}
              </h3>
              <p className="text-slate-400 text-sm font-medium line-clamp-2 mb-6">
                {meal.description || 'No description provided.'}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock size={12} /> 20 mins</span>
                  <span className="flex items-center gap-1.5"><User size={12} /> 2 people</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients?.map((ing) => (
                    <span key={ing.id} className="bg-slate-50 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-full border border-slate-100 uppercase tracking-tighter">
                      {ing.name}
                    </span>
                  ))}
                  {(!meal.ingredients || meal.ingredients.length === 0) && (
                    <span className="text-slate-300 text-[10px] font-bold italic uppercase tracking-widest">No ingredients</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMealId(meal.id)}
              className="mt-8 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white rounded-2xl py-4 transition-all duration-300 group/btn"
            >
              <LinkIcon size={14} className="group-hover/btn:rotate-12 transition-transform" /> 
              Manage Ingredients
              <ChevronRight size={14} className="opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
            </button>
          </div>
        ))}
        {meals.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Utensils size={40} />
            </div>
            <p className="text-slate-400 font-black text-xl tracking-tight">Your recipe box is empty</p>
            <p className="text-slate-300 font-medium mt-2">Start by adding your favorite meals.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-8 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-800 transition-colors"
            >
              Add first meal &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Modern Link Ingredient Modal */}
      {selectedMealId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <h3 className="text-2xl font-black mb-1 text-slate-800 tracking-tight">Add Ingredient</h3>
            <p className="text-slate-400 text-sm font-medium mb-8">Linking to: <span className="text-indigo-600 font-bold">{meals.find(m => m.id === selectedMealId)?.name}</span></p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Ingredient</label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose from pantry...</option>
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleLinkIngredient}
                  className="flex-[2] bg-indigo-600 text-white rounded-2xl py-4 font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Link Item
                </button>
                <button
                  onClick={() => setSelectedMealId(null)}
                  className="flex-1 bg-slate-100 text-slate-500 rounded-2xl py-4 font-black hover:bg-slate-200 active:scale-95 transition-all"
                >
                  Back
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
