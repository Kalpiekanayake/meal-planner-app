import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Clock, Calendar as CalendarIcon, Tag, StickyNote, AlertCircle } from 'lucide-react';
import { api } from '../api/api';
import { ShoppingItem } from '../api/types';

const ShoppingListPage: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.getShoppingList();
      setItems(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch shopping list:', err);
      setError('Could not load shopping list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.createShoppingItem(
        name, 
        quantity || undefined, 
        note || undefined, 
        targetDate || undefined
      );
      setName('');
      setQuantity('');
      setNote('');
      setTargetDate('');
      setIsAdding(false);
      fetchItems();
    } catch (err) {
      console.error('Failed to add item:', err);
      setError('Could not add item. Please try again.');
    }
  };

  const handleMarkAsBought = async (id: string) => {
    try {
      await api.markShoppingItemAsBought(id);
      fetchItems();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.deleteShoppingItem(id);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const pendingItems = items.filter(item => item.status === 'pending');
  const boughtItems = items.filter(item => item.status === 'bought');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Shopping List</h1>
          <p className="text-slate-500 font-medium mt-1">Manage items you need to buy.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 shrink-0"
        >
          {isAdding ? <Clock size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleAddItem} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Milk, Bread, Eggs"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Quantity (Optional)</label>
                <div className="relative">
                  <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 2 liters, 1 loaf"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Date (Optional)</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Note (Optional)</label>
                <div className="relative">
                  <StickyNote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any specific details..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
            >
              Save Item
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">Loading your shopping list...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-800">Your shopping list is empty</h3>
          <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto">
            Add items you need to buy, or plan meals to automatically find missing ingredients.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-8 text-indigo-600 font-bold hover:underline"
          >
            Add your first item
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Pending Items */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                Pending Items
                <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg text-xs font-black">
                  {pendingItems.length}
                </span>
              </h2>
            </div>
            
            {pendingItems.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
                <p className="text-slate-400 font-bold">No pending items. You're all set!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-grow">
                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </h3>
                        {item.quantity && (
                          <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleMarkAsBought(item.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-colors"
                          title="Mark as bought"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {(item.note || item.targetDate) && (
                      <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                        {item.note && (
                          <div className="flex items-start gap-2 text-xs text-slate-500">
                            <StickyNote size={14} className="shrink-0 mt-0.5" />
                            <p className="font-medium italic">{item.note}</p>
                          </div>
                        )}
                        {item.targetDate && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CalendarIcon size={14} className="shrink-0" />
                            <p className="font-medium">Needed by: {new Date(item.targetDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recently Bought */}
          {boughtItems.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-black text-slate-400 flex items-center gap-2">
                  Recently Bought
                  <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg text-xs font-black">
                    {boughtItems.length}
                  </span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boughtItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h3 className="font-bold text-slate-500 line-through decoration-slate-300">
                          {item.name}
                        </h3>
                        {item.quantity && (
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingListPage;
