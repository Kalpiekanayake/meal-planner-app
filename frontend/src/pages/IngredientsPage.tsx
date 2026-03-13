import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Trash2, Apple, Search, ShoppingCart, Plus, X, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Bakery', 'Drinks', 'Spices', 'Frozen', 'Household', 'Other'];

const IngredientsPage: React.FC = () => {
  const { ingredients, refreshData, loading, showToast, requireAuth } = useAppContext();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Other');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    requireAuth(async () => {
      setIsSubmitting(true);
      try {
        await api.createIngredient(name, category, quantity, unit);
        setName('');
        setQuantity('');
        setUnit('');
        setShowForm(false);
        showToast('Added to pantry', 'success');
        refreshData();
      } catch (err) {
        showToast('Failed to add ingredient', 'error');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    requireAuth(async () => {
      try {
        await api.updateIngredientAvailability(id, !current);
        refreshData();
      } catch (err) {
        showToast('Failed to update status', 'error');
      }
    });
  };

  const handleDeleteIngredient = async (id: string) => {
    requireAuth(async () => {
      if (!confirm('Remove this ingredient?')) return;
      try {
        await api.deleteIngredient(id);
        showToast('Ingredient removed', 'success');
        refreshData();
      } catch (err) {
        showToast('Failed to delete ingredient', 'error');
      }
    });
  };

  const handleAddToShoppingList = async (ing: any) => {
    requireAuth(async () => {
      try {
        await api.createShoppingItem(ing.name, ing.category, ing.quantity);
        showToast('Added to Shopping List', 'success');
      } catch (err) {
        showToast('Failed to add to shopping list', 'error');
      }
    });
  };

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && ingredients.length === 0) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing Pantry...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">       
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Ingredient Pantry</h1>        
          <p className="text-slate-500 font-medium mt-1">Track your stock and never run out.</p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'white' : 'primary'}
          size="lg"
          icon={showForm ? <X size={20} /> : <Plus size={20} />}
          className="shadow-xl"
        >
          {showForm ? 'Cancel' : 'New Ingredient'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-8 border-primary-50 animate-bounce-in" hoverable={false}>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800">
            <Apple size={24} className="text-primary-500" /> Pantry Entry
          </h2>
          <form onSubmit={handleCreateIngredient} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Greek Yogurt"
                required
              />
            </div>
            <Input
              label="Category"
              isSelect
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES.map(cat => ({ label: cat, value: cat }))}
            />
            <Input
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 500"
            />
            <Input
              label="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. g, ml, pcs"
            />
            <div className="md:col-span-full flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!name}
                size="lg"
                className="px-12"
              >
                Add to Pantry
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="relative max-w-md">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search pantry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] font-bold text-slate-700 focus:ring-4 focus:ring-primary-50 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIngredients.length === 0 ? (
          <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-primary-50 text-primary-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Apple size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Pantry is empty</h3>        
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">
              Start building your ingredient library to enable smart meal planning.
            </p>
          </div>
        ) : (
          filteredIngredients.map((ing) => (
            <Card
              key={ing.id}
              className={`p-6 flex flex-col justify-between group ${
                !ing.isAvailable ? 'bg-amber-50/30 border-amber-100' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${ing.isAvailable ? 'bg-primary-50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-6 shadow-sm shadow-primary-50' : 'bg-amber-100 text-amber-600'}`}>
                    <Apple size={24} />
                  </div>
                  <button
                    onClick={() => handleDeleteIngredient(ing.id)}
                    className="w-8 h-8 rounded-full bg-white text-slate-200 hover:text-red-500 shadow-sm border border-slate-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"  
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary" className="text-[9px]">
                      {ing.category}
                    </Badge>
                    {ing.isAvailable ? (
                      <Badge variant="success" className="text-[9px]">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[9px]">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{ing.name}</h3>        
                  {ing.quantity && (
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {ing.quantity} {ing.unit}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-3">
                <Button
                  onClick={() => !ing.isAvailable && handleToggleAvailability(ing.id, ing.isAvailable)}
                  disabled={ing.isAvailable}
                  variant={ing.isAvailable ? 'secondary' : 'white'}
                  size="sm"
                  className={`w-full text-[10px] ${ing.isAvailable ? 'opacity-100' : ''}`}
                  icon={ing.isAvailable ? <CheckCircle size={14} /> : null}
                >
                  {ing.isAvailable ? 'In Pantry' : 'Mark Available'}
                </Button>
                
                <Button
                  onClick={() => handleAddToShoppingList(ing)}
                  variant="white"
                  size="sm"
                  className="w-full text-[10px]"
                  icon={<ShoppingCart size={14} />}
                >
                  Buy This
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default IngredientsPage;
