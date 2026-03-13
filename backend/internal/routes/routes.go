package routes

import (
	"meal-planner-backend/internal/handlers"
	"net/http"
)

func SetupRoutes(
	mux *http.ServeMux,
	authHandler *handlers.AuthHandler,
	mealHandler *handlers.MealHandler,
	ingredientHandler *handlers.IngredientHandler,
	plannerHandler *handlers.PlannerHandler,
	notificationHandler *handlers.NotificationHandler,
	shoppingHandler *handlers.ShoppingHandler,
	authMiddleware func(http.Handler) http.Handler,
) {
	// Health check
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	// Auth routes (Public)
	mux.HandleFunc("POST /auth/register", authHandler.Register)
	mux.HandleFunc("POST /auth/login", authHandler.Login)

	// Protected routes
	protectedMux := http.NewServeMux()

	// Auth Me
	protectedMux.HandleFunc("GET /auth/me", authHandler.Me)

	// Meal routes
	protectedMux.HandleFunc("GET /meals", mealHandler.GetMeals)
	protectedMux.HandleFunc("GET /meals/{id}", mealHandler.GetMealByID)
	protectedMux.HandleFunc("POST /meals", mealHandler.CreateMeal)
	protectedMux.HandleFunc("POST /meals/get-or-create", mealHandler.GetOrCreateMeal)
	protectedMux.HandleFunc("DELETE /meals/{id}", mealHandler.DeleteMeal)

	// Ingredient routes
	protectedMux.HandleFunc("GET /ingredients", ingredientHandler.GetIngredients)
	protectedMux.HandleFunc("POST /ingredients", ingredientHandler.CreateIngredient)
	protectedMux.HandleFunc("POST /ingredients/get-or-create", ingredientHandler.GetOrCreateIngredient)
	protectedMux.HandleFunc("PATCH /ingredients/{id}/availability", ingredientHandler.UpdateAvailability)
	protectedMux.HandleFunc("DELETE /ingredients/{id}", ingredientHandler.DeleteIngredient)

	// Relationship routes
	protectedMux.HandleFunc("POST /meals/{mealId}/ingredients/{ingredientId}", ingredientHandler.LinkToMeal)

	// Planner routes
	protectedMux.HandleFunc("POST /planner", plannerHandler.CreatePlannerEntry)
	protectedMux.HandleFunc("GET /planner", plannerHandler.GetAllEntries)
	protectedMux.HandleFunc("GET /planner/{dayOfWeek}", plannerHandler.GetEntriesByDay)
	protectedMux.HandleFunc("DELETE /planner/{id}", plannerHandler.DeleteEntry)

	// Shopping routes
	protectedMux.HandleFunc("GET /shopping", shoppingHandler.GetItems)
	protectedMux.HandleFunc("POST /shopping", shoppingHandler.CreateItem)
	protectedMux.HandleFunc("PATCH /shopping/{id}/bought", shoppingHandler.MarkAsBought)
	protectedMux.HandleFunc("PATCH /shopping/{id}/pending", shoppingHandler.MarkAsPending)
	protectedMux.HandleFunc("DELETE /shopping/{id}", shoppingHandler.DeleteItem)

	// Notification routes
	protectedMux.HandleFunc("POST /notifications/generate", notificationHandler.Generate)
	protectedMux.HandleFunc("GET /notifications", notificationHandler.List)
	protectedMux.HandleFunc("PATCH /notifications/{id}/read", notificationHandler.MarkAsRead)
	protectedMux.HandleFunc("DELETE /notifications/{id}", notificationHandler.Delete)

	// Apply auth middleware to all protected routes
	mux.Handle("/", authMiddleware(protectedMux))
}
