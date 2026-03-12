import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

const IngredientsPage: React.FC = () => {
  const { ingredients, refreshData, loading, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await api.createIngredient(name);
      setName('');
      showToast('Ingredient added!', 'success');
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
      showToast('Ingredient deleted', 'success');
      refreshData();
    } catch (err) {
      showToast('Failed to delete ingredient', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <Plus size={24} className="text-indigo-600" /> Add New Ingredient
        </h2>
        <form onSubmit={handleCreateIngredient} className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border outline-none"
            placeholder="e.g. Fresh Tomatoes"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Ingredient'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {ingredients.map((ing) => (
          <div 
            key={ing.id} 
            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between h-40 group ${
              ing.isAvailable 
                ? 'bg-white border-white shadow-sm hover:shadow-md' 
                : 'bg-gray-50 border-gray-100 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className={`font-semibold text-gray-900 ${!ing.isAvailable && 'line-through text-gray-500'}`}>
                {ing.name}
              </h3>
              <button
                onClick={() => handleDeleteIngredient(ing.id)}
                className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <button
              onClick={() => handleToggleAvailability(ing.id, ing.isAvailable)}
              className={`mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                ing.isAvailable 
                  ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              {ing.isAvailable ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {ing.isAvailable ? 'AVAILABLE' : 'OUT OF STOCK'}
            </button>
          </div>
        ))}
        {ingredients.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 italic">
            No ingredients added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientsPage;
