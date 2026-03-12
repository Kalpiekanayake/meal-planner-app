import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

const MealsPage: React.FC = () => {
  const { meals, ingredients, refreshData, loading, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await api.createMeal(name, description);
      setName('');
      setDescription('');
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus size={24} /> Add New Meal
        </h2>
        <form onSubmit={handleCreateMeal} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Meal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="Spaghetti Bolognese"
            />
          </div>
          <div className="flex-[2]">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="Italian pasta with meat sauce"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Meal
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div key={meal.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border-l-4 border-indigo-500">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">{meal.name}</h3>
                <button
                  onClick={() => handleDeleteMeal(meal.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">{meal.description}</p>
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700">Ingredients:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {meal.ingredients?.map((ing) => (
                    <span key={ing.id} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-100">
                      {ing.name}
                    </span>
                  ))}
                  {(!meal.ingredients || meal.ingredients.length === 0) && (
                    <span className="text-gray-400 text-xs italic">No ingredients linked</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMealId(meal.id)}
              className="mt-6 flex items-center justify-center gap-2 text-sm text-indigo-600 font-medium border border-indigo-600 rounded-md py-2 hover:bg-indigo-50 transition-colors"
            >
              <LinkIcon size={16} /> Link Ingredients
            </button>
          </div>
        ))}
      </div>

      {/* Link Ingredient Modal/Overlay */}
      {selectedMealId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Add Ingredient to {meals.find(m => m.id === selectedMealId)?.name}</h3>
            <select
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            >
              <option value="">Select an ingredient...</option>
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>{ing.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleLinkIngredient}
                className="flex-1 bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700"
              >
                Add
              </button>
              <button
                onClick={() => setSelectedMealId(null)}
                className="flex-1 bg-gray-200 text-gray-700 rounded-md py-2 font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsPage;
