import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meal, Ingredient, PlannerEntry, Notification } from '../api/types';
import { api } from '../api/api';

interface AppContextType {
  meals: Meal[];
  ingredients: Ingredient[];
  planner: PlannerEntry[];
  notifications: Notification[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [planner, setPlanner] = useState<PlannerEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ meals, ingredients, planner, notifications, loading, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
