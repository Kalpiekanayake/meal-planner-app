import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Meal, Ingredient, PlannerEntry, Notification, ShoppingItem } from '../api/types';
import { api } from '../api/api';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

interface AppContextType {
  meals: Meal[];
  ingredients: Ingredient[];
  planner: PlannerEntry[];
  notifications: Notification[];
  shoppingList: ShoppingItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  addMissingIngredientsToShoppingList: (mealId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [planner, setPlanner] = useState<PlannerEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const refreshData = async () => {
    try {
      const [m, i, p, n, s] = await Promise.all([
        api.getMeals(),
        api.getIngredients(),
        api.getPlanner(),
        api.getNotifications(),
        api.getShoppingList(),
      ]);
      setMeals(m || []);
      setIngredients(i || []);
      setPlanner(p || []);
      setNotifications(n || []);
      setShoppingList(s || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      // showToast('Failed to load data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addMissingIngredientsToShoppingList = async (mealId: string) => {
    try {
      const meal = meals.find(m => m.id === mealId);
      if (!meal) return;

      const missingIngredients = meal.ingredients?.filter(ing => !ing.isAvailable) || [];
      
      if (missingIngredients.length === 0) {
        showToast('All ingredients are already available!', 'info');
        return;
      }

      await Promise.all(
        missingIngredients.map(ing => api.createShoppingItem(ing.name, undefined, `Added from meal: ${meal.name}`))
      );

      showToast(`Added ${missingIngredients.length} ingredients to shopping list`, 'success');
      refreshData();
    } catch (error) {
      console.error('Failed to add ingredients to shopping list', error);
      showToast('Failed to add ingredients to shopping list', 'error');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ 
      meals, 
      ingredients, 
      planner, 
      notifications, 
      shoppingList,
      loading, 
      refreshData, 
      showToast,
      addMissingIngredientsToShoppingList
    }}>
      {children}
      {/* Toast UI */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${
              toast.type === 'success' ? 'bg-indigo-600 shadow-indigo-200' : 
              toast.type === 'error' ? 'bg-red-600 shadow-red-200' : 'bg-slate-800 shadow-slate-200'
            } text-white px-6 py-4 rounded-2xl shadow-xl animate-in slide-in-from-right-8 duration-300 flex items-center gap-3 min-w-[300px] border border-white/10 backdrop-blur-md`}
          >
            <div className="bg-white/20 p-1.5 rounded-lg shrink-0">
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold tracking-tight">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
