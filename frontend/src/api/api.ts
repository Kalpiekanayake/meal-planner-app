import { Meal, Ingredient, PlannerEntry, Notification, ShoppingItem, User } from './types';

const API_BASE_URL = "https://6c905a3b-3aaf-44b8-9641-4c2e8a899abb-dev.e1-us-east-azure.choreoapis.dev/crave-meal-planner/backend-gl/v1.0";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  console.log(`[API] ${options?.method || 'GET'} ${url}`, options?.body ? JSON.parse(options.body as string) : '');
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/register')) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Error] ${response.status} ${response.statusText}: ${errorText}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    console.log(`[API Success] ${url}`, data);
    return data;
  } catch (error) {
    console.error(`[API Fetch Error] ${url}`, error);
    throw error;
  }
}

export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    fetcher<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    fetcher<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => fetcher<User>('/auth/me'),

  // Meals
  getMeals: () => fetcher<Meal[]>('/meals'),
  getMeal: (id: string) => fetcher<Meal>(`/meals/${id}`),
  createMeal: (name: string) =>
    fetcher<Meal>('/meals', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  getOrCreateMeal: (name: string) =>
    fetcher<Meal>('/meals/get-or-create', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  deleteMeal: (id: string) => fetcher<void>(`/meals/${id}`, { method: 'DELETE' }),

  // Ingredients
  getIngredients: () => fetcher<Ingredient[]>('/ingredients'),
  createIngredient: (name: string, category: string, quantity: string, unit: string) =>
    fetcher<Ingredient>('/ingredients', {
      method: 'POST',
      body: JSON.stringify({ name, category, quantity, unit }),
    }),
  getOrCreateIngredient: (name: string) =>
    fetcher<Ingredient>('/ingredients/get-or-create', {
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

  // Shopping List
  getShoppingList: () => fetcher<ShoppingItem[]>('/shopping'),
  createShoppingItem: (name: string, category: string, quantity?: string, note?: string, targetDate?: string) =>
    fetcher<ShoppingItem>('/shopping', {
      method: 'POST',
      body: JSON.stringify({ name, category, quantity, note, targetDate }),
    }),
  markShoppingItemAsBought: (id: string) =>
    fetcher<ShoppingItem>(`/shopping/${id}/bought`, { method: 'PATCH' }),
  markShoppingItemAsPending: (id: string) =>
    fetcher<ShoppingItem>(`/shopping/${id}/pending`, { method: 'PATCH' }),
  deleteShoppingItem: (id: string) => fetcher<void>(`/shopping/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => fetcher<Notification[]>('/notifications'),
  markNotificationAsRead: (id: string) =>
    fetcher<Notification>(`/notifications/${id}/read`, { method: 'PATCH' }),
  generateNotifications: () => fetcher<string>('/notifications/generate', { method: 'POST' }),
  deleteNotification: (id: string) => fetcher<void>(`/notifications/${id}`, { method: 'DELETE' }),
};
