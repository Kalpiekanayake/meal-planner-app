import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/api';
import { Calendar, Plus, ChevronRight, ShoppingCart, AlertTriangle, CheckCircle2, X, Coffee, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = [
  { name: 'Breakfast', icon: <Coffee size={18} />, color: 'text-amber-500', bg: 'bg-amber-50' },
  { name: 'Lunch', icon: <Sun size={18} />, color: 'text-primary-500', bg: 'bg-primary-50' },
  { name: 'Dinner', icon: <Moon size={18} />, color: 'text-indigo-500', bg: 'bg-indigo-50' }
];

const WeeklyPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { meals, planner, refreshData, loading, showToast, addMissingIngredientsToShoppingList, requireAuth } = useAppContext();
  const [day, setDay] = useState('Monday');
  const [mealType, setMealType] = useState('Lunch');
  const [mealSearch, setMealSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mealInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlanClick = (selectedDay: string, selectedType: string) => {
    setDay(selectedDay);
    setMealType(selectedType);
    setShowQuickAdd(true);
    
    // Smooth scroll to top form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Focus the input after a short delay for the scroll/render
    setTimeout(() => {
      mealInputRef.current?.focus();
    }, 500);
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalMealName = mealSearch.trim();
    if (!finalMealName) return;

    requireAuth(async () => {
      setIsSubmitting(true);
      try {
        const meal = await api.getOrCreateMeal(finalMealName);
        await api.createPlannerEntry(day, mealType, meal.id);

        showToast(
          meals.find(m => m.id === meal.id)
            ? 'Added to your schedule!'
            : `Created "${meal.name}" and added to schedule!`,
          'success'
        );

        setMealSearch('');
        setShowQuickAdd(false);
        refreshData();
      } catch (err) {
        showToast('Failed to add entry', 'error');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleDeleteEntry = async (id: string) => {
    requireAuth(async () => {
      try {
        await api.deletePlannerEntry(id);
        showToast('Entry removed', 'success');
        refreshData();
      } catch (err) {
        showToast('Failed to remove entry', 'error');
      }
    });
  };

  const getMissingIngredientsCount = (mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (!meal || !meal.ingredients) return 0;
    return meal.ingredients.filter(ing => !ing.isAvailable).length;
  };

  const filteredMeals = meals.filter(m =>
    m.name.toLowerCase().includes(mealSearch.toLowerCase())
  );

  const exactMatch = meals.find(m => m.name.toLowerCase() === mealSearch.toLowerCase().trim());

  if (loading && planner.length === 0) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Schedule...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">       
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Weekly Planner</h1>
          <p className="text-slate-500 font-medium mt-1">What's on the menu this week?</p>
        </div>

        <Button
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          variant={showQuickAdd ? 'white' : 'primary'}
          size="lg"
          icon={showQuickAdd ? <X size={20} /> : <Plus size={20} />}
          className="shadow-xl"
        >
          {showQuickAdd ? 'Cancel' : 'Plan a Meal'}
        </Button>
      </div>

      {showQuickAdd && (
        <Card className="p-8 border-primary-50 animate-bounce-in" hoverable={false}>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800">
            <Calendar size={24} className="text-primary-500" /> New Plan Entry
          </h2>
          <form onSubmit={handleCreateEntry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Day"
              isSelect
              value={day}
              onChange={(e) => setDay(e.target.value)}
              options={DAYS.map(d => ({ label: d, value: d }))}
            />
            <Input
              label="Meal Time"
              isSelect
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              options={MEAL_TYPES.map(m => ({ label: m.name, value: m.name }))}
            />
            
            <div className="relative" ref={dropdownRef}>
              <Input
                ref={mealInputRef}
                label="Meal Name"
                value={mealSearch}
                onChange={(e) => {
                  setMealSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="e.g. Pasta Salad"
                autoComplete="off"
              />
              
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-60 overflow-y-auto py-2">
                  {filteredMeals.length > 0 ? (
                    filteredMeals.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMealSearch(m.name);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-primary-50 flex items-center justify-between group"
                      >
                        <span className="font-bold text-slate-700">{m.name}</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                      </button>
                    ))
                  ) : mealSearch.trim() ? (
                    <div className="px-6 py-3 text-slate-400 italic text-sm">No matching meals.</div>     
                  ) : (
                    <div className="px-6 py-3 text-slate-400 italic text-sm">Start typing...</div>        
                  )}

                  {mealSearch.trim() && !exactMatch && (
                    <button
                      type="button"
                      onClick={() => setShowDropdown(false)}
                      className="w-full text-left px-6 py-4 bg-primary-50/50 hover:bg-primary-100 border-t border-primary-50 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white shrink-0">
                        <Plus size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Create New</p>
                        <p className="font-bold text-slate-700">"{mealSearch}"</p>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-end">
              <Button 
                type="submit" 
                className="w-full h-[60px]" 
                isLoading={isSubmitting}
                disabled={!mealSearch.trim()}
                size="lg"
              >
                Add to Schedule
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {DAYS.map(d => (
          <div key={d} className="bg-slate-50/40 rounded-[3rem] shadow-lg shadow-slate-200/40 border-2 border-slate-100/80 flex flex-col overflow-hidden h-full hover:shadow-2xl hover:shadow-primary-100/30 hover:border-primary-100/50 transition-all duration-500 group/day">
            <div className="p-8 bg-white border-b-2 border-slate-100 flex items-center justify-between group-hover/day:bg-primary-50/30 transition-colors">
              <h3 className="font-black text-slate-800 uppercase tracking-[0.25em] text-sm">{d}</h3>       
              <span className="w-10 h-10 rounded-2xl bg-slate-50 shadow-inner border border-slate-100 flex items-center justify-center text-xs font-black text-primary-600 group-hover/day:bg-white group-hover/day:scale-110 transition-all">
                {planner.filter(e => e.dayOfWeek === d).length}
              </span>
            </div>

            <div className="p-6 flex-grow space-y-10">
              {MEAL_TYPES.map(type => {
                const dayEntries = planner.filter(entry => entry.dayOfWeek === d && entry.mealType === type.name);

                return (
                  <div key={type.name} className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                      <div className={`${type.bg} ${type.color} p-1.5 rounded-lg`}>
                        {type.icon}
                      </div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type.name}</h4>
                    </div>

                    <div className="space-y-3">
                      {dayEntries.map(entry => {
                        const missingCount = getMissingIngredientsCount(entry.mealId);
                        const meal = meals.find(m => m.id === entry.mealId);
                        const hasIngredients = meal && meal.ingredients && meal.ingredients.length > 0;

                        return (
                          <Card
                            key={entry.id}
                            className="p-5 relative group"
                            onClick={() => navigate(`/meals?highlight=${entry.mealId}`)}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEntry(entry.id);
                              }}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-white text-slate-300 hover:text-red-500 shadow-sm border border-slate-50 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
                            >
                              <X size={14} />
                            </button>

                            <div className="flex flex-col items-start gap-1 pr-4">
                              <div className="font-black text-slate-800 leading-tight text-left group-hover:text-primary-600 transition-colors">
                                {entry.meal?.name}
                              </div>
                              {!hasIngredients && (
                                <p className="text-[10px] font-bold text-slate-400 italic">Ingredients not linked yet</p>
                              )}
                              <p className="text-[8px] font-black text-primary-500 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-[0.15em] mt-1">
                                Manage in Meals Library
                              </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-3">      
                              {missingCount > 0 ? (
                                <>
                                  <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 uppercase tracking-tighter">
                                    <AlertTriangle size={12} />
                                    <span>{missingCount} missing items</span>
                                  </div>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addMissingIngredientsToShoppingList(entry.mealId);
                                    }}
                                    variant="secondary"
                                    size="sm"
                                    className="w-full text-[10px]"
                                    icon={<ShoppingCart size={12} />}
                                  >
                                    Get Items
                                  </Button>
                                </>
                              ) : (
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                                  <CheckCircle2 size={12} />
                                  <span>Ready to cook</span>
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })}

                      {/* Always show Add button to allow multiple items */}
                      <button
                        onClick={() => handlePlanClick(d, type.name)}   
                        className={`w-full border-2 border-dashed border-slate-100 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-100 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-600 transition-all group ${dayEntries.length > 0 ? 'p-3' : 'p-4'}`}
                      >
                         <Plus size={dayEntries.length > 0 ? 14 : 16} className="group-hover:scale-110 transition-transform" />      
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {dayEntries.length > 0 ? `Add to ${type.name}` : 'Plan'}
                         </span> 
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlannerPage;
