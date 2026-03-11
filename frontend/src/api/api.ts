import { Meal, Ingredient, PlannerEntry, Notification } from './types';

const API_BASE_URL = 'http://localhost:8080';

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Meals
  getMeals: () => fetcher<Meal[]>('/meals'),
  getMeal: (id: string) => fetcher<Meal>(`/meals/${id}`),
  createMeal: (name: string, description: string) =>
    fetcher<Meal>('/meals', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    }),
  deleteMeal: (id: string) => fetcher<void>(`/meals/${id}`, { method: 'DELETE' }),

  // Ingredients
  getIngredients: () => fetcher<Ingredient[]>('/ingredients'),
  createIngredient: (name: string) =>
    fetcher<Ingredient>('/ingredients', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  updateIngredientAvailability: (id: string, isAvailable: boolean) =>
    fetcher<Ingredient>(`/ingredients/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    }),
  deleteIngredient: (id: string) => fetcher<void>(`/ingredients/${id}`, { method: 'DELETE' }),
  linkIngredientToMeal: (mealId: string, ingredientId: string) =>
    fetcher<Meal>(`/meals/${mealId}/ingredients/${ingredientId}`, { method: 'POST' }),

  // Planner
  getPlanner: () => fetcher<PlannerEntry[]>('/planner'),
  getPlannerByDay: (day: string) => fetcher<PlannerEntry[]>(`/planner/${day}`),
  createPlannerEntry: (dayOfWeek: string, mealType: string, mealId: string) =>
    fetcher<PlannerEntry>('/planner', {
      method: 'POST',
      body: JSON.stringify({ dayOfWeek, mealType, mealId }),
    }),
  deletePlannerEntry: (id: string) => fetcher<void>(`/planner/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => fetcher<Notification[]>('/notifications'),
  getNotificationsByDay: (day: string) => fetcher<Notification[]>(`/notifications/${day}`),
  generateNotifications: () => fetcher<string>('/notifications/generate', { method: 'POST' }),
  deleteNotification: (id: string) => fetcher<void>(`/notifications/${id}`, { method: 'DELETE' }),
};
