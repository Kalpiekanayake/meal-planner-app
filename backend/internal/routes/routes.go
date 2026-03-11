package routes

import (
	"meal-planner-backend/internal/handlers"
	"net/http"
)

func SetupRoutes(
	mux *http.ServeMux,
	mealHandler *handlers.MealHandler,
	ingredientHandler *handlers.IngredientHandler,
	plannerHandler *handlers.PlannerHandler,
	notificationHandler *handlers.NotificationHandler,
) {
	// Health check
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	// Meal routes
	mux.HandleFunc("GET /meals", mealHandler.GetMeals)
	mux.HandleFunc("GET /meals/{id}", mealHandler.GetMealByID)
	mux.HandleFunc("POST /meals", mealHandler.CreateMeal)
	mux.HandleFunc("DELETE /meals/{id}", mealHandler.DeleteMeal)

	// Ingredient routes
	mux.HandleFunc("GET /ingredients", ingredientHandler.GetIngredients)
	mux.HandleFunc("POST /ingredients", ingredientHandler.CreateIngredient)
	mux.HandleFunc("DELETE /ingredients/{id}", ingredientHandler.DeleteIngredient)
	mux.HandleFunc("PATCH /ingredients/{id}/availability", notificationHandler.UpdateIngredientAvailability)

	// Relationship routes
	mux.HandleFunc("POST /meals/{mealId}/ingredients/{ingredientId}", ingredientHandler.LinkToMeal)

	// Planner routes
	mux.HandleFunc("POST /planner", plannerHandler.CreatePlannerEntry)
	mux.HandleFunc("GET /planner", plannerHandler.GetAllEntries)
	mux.HandleFunc("GET /planner/{dayOfWeek}", plannerHandler.GetEntriesByDay)
	mux.HandleFunc("DELETE /planner/{id}", plannerHandler.DeleteEntry)

	// Notification routes
	mux.HandleFunc("POST /notifications/generate", notificationHandler.Generate)
	mux.HandleFunc("GET /notifications", notificationHandler.List)
	mux.HandleFunc("GET /notifications/{dayOfWeek}", notificationHandler.GetByDay)
	mux.HandleFunc("DELETE /notifications/{id}", notificationHandler.Delete)
}
