import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Meal, Ingredient, PlannerEntry, Notification, ShoppingItem } from '../api/types';
import { api } from '../api/api';
import { useAuth } from './AuthContext';
import LoginModal from '../components/LoginModal';

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
  requireAuth: (action: () => void) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [planner, setPlanner] = useState<PlannerEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const requireAuth = (action: () => void) => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      action();
    }
  };

  const refreshData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const addMissingIngredientsToShoppingList = async (mealId: string) => {
    requireAuth(async () => {
      try {
        const meal = meals.find(m => m.id === mealId);
        if (!meal) return;

        const missingIngredients = meal.ingredients?.filter(ing => !ing.isAvailable) || [];
        
        if (missingIngredients.length === 0) {
          showToast('All ingredients are already available!', 'info');
          return;
        }

        // Identify which items are already in the shopping list (case-insensitive)
        const newItems = missingIngredients.filter(ing => 
          !shoppingList.some(item => item.name.toLowerCase() === ing.name.toLowerCase())
        );

        const existingCount = missingIngredients.length - newItems.length;

        if (newItems.length > 0) {
          // Add only the new items
          await Promise.all(
            newItems.map(ing => 
              api.createShoppingItem(
                ing.name, 
                ing.category || 'Other', 
                ing.quantity, 
                `Required for: ${meal.name}`
              )
            )
          );

          if (existingCount > 0) {
            showToast('Added missing items to Shopping List. Some items were already in your Shopping List.', 'success');
          } else {
            showToast('Added missing items to Shopping List', 'success');
          }
        } else {
          // All items already exist
          if (missingIngredients.length === 1) {
            showToast(`${missingIngredients[0].name} is already in your Shopping List`, 'info');
          } else {
            showToast('All missing items were already in your Shopping List', 'info');
          }
        }

        refreshData();
      } catch (error) {
        console.error('Failed to add ingredients to shopping list', error);
        showToast('Failed to add ingredients', 'error');
      }
    });
  };

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setMeals([]);
      setIngredients([]);
      setPlanner([]);
      setNotifications([]);
      setShoppingList([]);
    }
  }, [user]);

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
      addMissingIngredientsToShoppingList,
      requireAuth
    }}>
      {children}
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Toast UI */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${
              toast.type === 'success' ? 'bg-teal-600' : 
              toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
            } text-white px-6 py-4 rounded-[1.5rem] shadow-2xl animate-in slide-in-from-right-8 duration-300 flex items-center gap-3 min-w-[320px] border border-white/10 backdrop-blur-md`}
          >
            <div className="bg-white/20 p-2 rounded-xl shrink-0 text-xl">
              {toast.type === 'success' ? '✨' : toast.type === 'error' ? '🚫' : '💡'}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-black tracking-tight">{toast.message}</p>
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
