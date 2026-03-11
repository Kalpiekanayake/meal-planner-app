export interface Meal {
  id: string;
  name: string;
  description?: string;
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

export interface Notification {
  id: string;
  dayOfWeek: string;
  mealType: string;
  missingIngredients: string;
  createdAt: string;
}
