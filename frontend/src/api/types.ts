export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Meal {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity?: string;
  unit?: string;
  isAvailable: boolean;
  userId: string;
  createdAt: string;
}

export interface PlannerEntry {
  id: string;
  dayOfWeek: string;
  mealType: string;
  mealId: string;
  userId: string;
  meal: Meal;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity?: string;
  note?: string;
  status: 'pending' | 'bought';
  targetDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'shopping' | 'missing_ingredient' | 'forgotten_item';
  isRead: boolean;
  userId: string;
  createdAt: string;
}
