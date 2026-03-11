package routes

import (
	"meal-planner-backend/internal/handlers"
	"net/http"
)

func SetupRoutes(mux *http.ServeMux, mealHandler *handlers.MealHandler) {
	// Health check
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	// Meal routes
	mux.HandleFunc("GET /meals", mealHandler.GetMeals)
	mux.HandleFunc("GET /meals/{id}", mealHandler.GetMealByID)
	mux.HandleFunc("POST /meals", mealHandler.CreateMeal)
	mux.HandleFunc("DELETE /meals/{id}", mealHandler.DeleteMeal)
}
