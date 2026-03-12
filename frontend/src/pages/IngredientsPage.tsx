import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Trash2, CheckCircle, XCircle, Apple, ShoppingBasket, Search, Tag } from 'lucide-react';

const IngredientsPage: React.FC = () => {
  const { ingredients, refreshData, loading, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await api.createIngredient(name);
      setName('');
      showToast('Ingredient added to pantry!', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to add ingredient', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      await api.updateIngredientAvailability(id, !current);
      showToast(`Marked as ${!current ? 'available' : 'out of stock'}`, 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    try {
      await api.deleteIngredient(id);
      showToast('Ingredient removed', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to delete ingredient', 'error');
    }
  };

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Pantry...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pantry Inventory</h1>
          <p className="text-slate-500 font-medium">Keep track of what ingredients you have in stock.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group min-w-[300px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search ingredients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar Form */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-28">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <ShoppingBasket size={24} />
            </div>
            <h2 className="text-xl font-black mb-1 text-slate-800 tracking-tight">Add Item</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">New Ingredient</p>
            
            <form onSubmit={handleCreateIngredient} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ingredient Name</label>
                <div className="relative">
                  <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all border outline-none font-bold text-slate-700 placeholder:text-slate-300"
                    placeholder="e.g. Olive Oil"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !name}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? 'Adding...' : 'Add to Pantry'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 text-center">Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-slate-800">{ingredients.length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-green-600">{ingredients.filter(i => i.isAvailable).length}</p>
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">In Stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIngredients.map((ing) => (
              <div 
                key={ing.id} 
                className={`p-5 rounded-[1.5rem] border-2 transition-all duration-300 flex flex-col justify-between group h-44 relative overflow-hidden ${
                  ing.isAvailable 
                    ? 'bg-white border-white shadow-sm hover:shadow-xl hover:border-indigo-50' 
                    : 'bg-slate-50/50 border-slate-100 opacity-60'
                }`}
              >
                {ing.isAvailable && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -z-10 opacity-40 group-hover:scale-150 transition-transform duration-500"></div>
                )}
                
                <div className="flex justify-between items-start relative">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ing.isAvailable ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Apple size={20} />
                    </div>
                    <h3 className={`font-black text-lg tracking-tight ${!ing.isAvailable ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {ing.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDeleteIngredient(ing.id)}
                    className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <button
                  onClick={() => handleToggleAvailability(ing.id, ing.isAvailable)}
                  className={`mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${
                    ing.isAvailable 
                      ? 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white shadow-sm shadow-green-100' 
                      : 'bg-slate-200 text-slate-500 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {ing.isAvailable ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {ing.isAvailable ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>
            ))}
            
            {filteredIngredients.length === 0 && (
              <div className="col-span-full py-32 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <Apple size={40} />
                </div>
                <p className="text-slate-400 font-black text-xl tracking-tight">No ingredients found</p>
                <p className="text-slate-300 font-medium mt-2">Try searching for something else or add a new item.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsPage;
