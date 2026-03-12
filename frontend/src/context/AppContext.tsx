import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meal, Ingredient, PlannerEntry, Notification } from '../api/types';
import { api } from '../api/api';

interface Toast {
  message: string;
  type: 'success' | 'error';
  id: number;
}

interface AppContextType {
  meals: Meal[];
  ingredients: Ingredient[];
  planner: PlannerEntry[];
  notifications: Notification[];
  loading: boolean;
  refreshData: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [planner, setPlanner] = useState<PlannerEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const refreshData = async () => {
    try {
      const [m, i, p, n] = await Promise.all([
        api.getMeals(),
        api.getIngredients(),
        api.getPlanner(),
        api.getNotifications(),
      ]);
      setMeals(m || []);
      setIngredients(i || []);
      setPlanner(p || []);
      setNotifications(n || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      showToast('Failed to load data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ meals, ingredients, planner, notifications, loading, refreshData, showToast }}>
      {children}
      {/* Toast UI */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce-in flex items-center gap-2 min-w-[200px] transition-all duration-300`}
          >
            {toast.type === 'success' ? '✅' : '❌'}
            {toast.message}
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
