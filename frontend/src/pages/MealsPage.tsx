import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Plus, Trash2, Utensils, ChevronRight, X, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const MealsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const { meals, ingredients, refreshData, loading, showToast, requireAuth } = useAppContext();
  const [name, setName] = useState('');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedMealId, setHighlightedMealId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightId && !loading && meals.length > 0) {
      setHighlightedMealId(highlightId);
      
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        const element = document.getElementById(highlightId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);

      const clearTimer = setTimeout(() => setHighlightedMealId(null), 3000);
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [highlightId, loading, meals.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    requireAuth(async () => {
      setIsSubmitting(true);
      try {
        await api.createMeal(name);
        setName('');
        setShowForm(false);
        showToast('Meal added to library', 'success');
        refreshData();
      } catch (err) {
        showToast('Failed to create meal', 'error');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleDeleteMeal = async (id: string) => {
    requireAuth(async () => {
      if (!confirm('Delete this meal from your library?')) return;
      try {
        await api.deleteMeal(id);
        showToast('Meal deleted', 'success');
        refreshData();
      } catch (err) {
        showToast('Failed to delete meal', 'error');
      }
    });
  };

  const handleLinkIngredient = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalIngName = ingredientSearch.trim();
    if (!selectedMealId || !finalIngName) return;

    requireAuth(async () => {
      setIsSubmitting(true);
      try {
        const ingredient = await api.getOrCreateIngredient(finalIngName);
        await api.linkIngredientToMeal(selectedMealId, ingredient.id);

        showToast(
          ingredients.find(i => i.id === ingredient.id)
            ? 'Ingredient linked'
            : `Created "${ingredient.name}" and linked`,
          'success'
        );

        setIngredientSearch('');
        setSelectedMealId(null);
        setShowDropdown(false);
        refreshData();
      } catch (err) {
        showToast('Failed to link ingredient', 'error');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIngredients = ingredients.filter(i =>
    i.name.toLowerCase().includes(ingredientSearch.toLowerCase()) &&
    !meals.find(m => m.id === selectedMealId)?.ingredients?.find(mi => mi.id === i.id)
  );

  const exactIngMatch = ingredients.find(i => i.name.toLowerCase() === ingredientSearch.toLowerCase().trim());

  if (loading && meals.length === 0) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Meals...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">       
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Meals Library</h1>
          <p className="text-slate-500 font-medium mt-1">Your collection of favorite dishes.</p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'white' : 'primary'}
          size="lg"
          icon={showForm ? <X size={20} /> : <Plus size={20} />}
          className="shadow-xl"
        >
          {showForm ? 'Cancel' : 'New Meal'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-8 border-primary-50 animate-bounce-in" hoverable={false}>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800">
            <Utensils size={24} className="text-primary-500" /> Meal Details
          </h2>
          <form onSubmit={handleCreateMeal} className="space-y-6">
            <Input
              label="Meal Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Creamy Mushroom Risotto"
              className="text-xl font-black"
              required
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!name}
                size="lg"
                className="px-12"
              >
                Add to Library
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search your meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] font-bold text-slate-700 focus:ring-4 focus:ring-primary-50 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredMeals.length === 0 ? (
          <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-primary-50 text-primary-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Utensils size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Library is empty</h3>       
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">
              Add your favorite meals to make weekly planning a breeze.
            </p>
          </div>
        ) : (
          filteredMeals.map((meal) => (
            <Card
              id={meal.id}
              key={meal.id}
              className={`p-8 group flex flex-col transition-all duration-500 ${highlightedMealId === meal.id ? 'highlight-pulse shadow-2xl scale-[1.02] border-primary-200' : ''}`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-6 shadow-sm shadow-primary-50">
                  <Utensils size={32} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-800 leading-tight mb-6 group-hover:text-primary-600 transition-colors">
                {meal.name}
              </h3>

              <div className="flex-grow space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ingredients</span>
                  <div className="flex-grow h-px bg-slate-50"></div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {meal.ingredients?.map((ing) => (
                    <Badge
                      key={ing.id}
                      variant={ing.isAvailable ? 'success' : 'warning'}
                      className="text-[9px]"
                    >
                      {ing.name}
                    </Badge>
                  ))}
                  {(!meal.ingredients || meal.ingredients.length === 0) && (
                    <p className="text-xs font-bold text-slate-300 italic">No ingredients linked yet.</p> 
                  )}
                </div>
              </div>

              <Button
                onClick={() => {
                  setSelectedMealId(meal.id);
                  setIngredientSearch('');
                  setShowDropdown(false);
                }}
                variant="white"
                className="mt-10 w-full group/btn"
                icon={<Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />}
              >
                Link Ingredients
              </Button>
            </Card>
          ))
        )}
      </div>

      {/* Link Ingredient Modal */}
      {selectedMealId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
          <Card className="p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden" hoverable={false}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-50 rounded-bl-full -z-10 opacity-50"></div>

            <h3 className="text-3xl font-black mb-1 text-slate-800 tracking-tight">Add Ingredient</h3>    
            <p className="text-slate-400 text-sm font-medium mb-10">To: <span className="text-primary-600 font-bold">{meals.find(m => m.id === selectedMealId)?.name}</span></p>

            <form onSubmit={handleLinkIngredient} className="space-y-10">
              <div className="relative" ref={dropdownRef}>
                <Input
                  label="Search or Type"
                  value={ingredientSearch}
                  onChange={(e) => {
                    setIngredientSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="e.g. Baby Spinach"
                  autoComplete="off"
                />

                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 z-50 max-h-60 overflow-y-auto py-2">
                    {filteredIngredients.length > 0 ? (
                      filteredIngredients.map(i => (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => {
                            setIngredientSearch(i.name);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-6 py-4 hover:bg-primary-50 flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <p className="font-bold text-slate-700">{i.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{i.category}</p>
                          </div>
                          <ChevronRight size={16} className="text-slate-200 group-hover:text-primary-500 transition-colors" />
                        </button>
                      ))
                    ) : ingredientSearch.trim() ? (
                      <div className="px-6 py-4 text-slate-400 italic text-sm">No existing matches.</div> 
                    ) : (
                      <div className="px-6 py-4 text-slate-400 italic text-sm">Start typing...</div>      
                    )}

                    {ingredientSearch.trim() && !exactIngMatch && (
                      <button
                        type="button"
                        onClick={() => setShowDropdown(false)}
                        className="w-full text-left px-6 py-5 bg-primary-50/50 hover:bg-primary-100 border-t border-primary-50 flex items-center gap-4"
                      >
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-100">
                          <Plus size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Create & Link</p>
                          <p className="font-black text-slate-700">"{ingredientSearch}"</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={!ingredientSearch.trim()}
                  size="lg"
                  className="flex-[2]"
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  onClick={() => setSelectedMealId(null)}
                  variant="white"
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MealsPage;
