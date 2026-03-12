export interface Meal {
  id: string;
  name: string;
  createdAt: string;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface PlannerEntry {
  id: string;
  dayOfWeek: string;
  mealType: string;
  mealId: string;
  meal: Meal;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  note?: string;
  status: 'pending' | 'bought';
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'shopping' | 'missing_ingredient' | 'forgotten_item';
  isRead: boolean;
  createdAt: string;
}
