import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

const IngredientsPage: React.FC = () => {
  const { ingredients, refreshData, loading } = useAppContext();
  const [name, setName] = useState('');

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await api.createIngredient(name);
      setName('');
      refreshData();
    } catch (err) {
      alert('Failed to create ingredient');
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      await api.updateIngredientAvailability(id, !current);
      refreshData();
    } catch (err) {
      alert('Failed to update availability');
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.deleteIngredient(id);
      refreshData();
    } catch (err) {
      alert('Failed to delete ingredient');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus size={24} /> Add New Ingredient
        </h2>
        <form onSubmit={handleCreateIngredient} className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="Tomato"
          />
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Ingredient
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ingredients.map((ing) => (
              <tr key={ing.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ing.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleToggleAvailability(ing.id, ing.isAvailable)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      ing.isAvailable 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {ing.isAvailable ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {ing.isAvailable ? 'Available' : 'Out of Stock'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteIngredient(ing.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientsPage;
