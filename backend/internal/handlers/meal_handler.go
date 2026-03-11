package handlers

import (
	"encoding/json"
	"meal-planner-backend/internal/services"
	"net/http"
)

type MealHandler struct {
	service services.MealService
}

func NewMealHandler(service services.MealService) *MealHandler {
	return &MealHandler{service: service}
}

func (h *MealHandler) GetMeals(w http.ResponseWriter, r *http.Request) {
	meals, err := h.service.GetMeals(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meals)
}

type createMealRequest struct {
	Name     string `json:"name"`
	Calories int    `json:"calories"`
}

func (h *MealHandler) CreateMeal(w http.ResponseWriter, r *http.Request) {
	var req createMealRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	meal, err := h.service.AddMeal(r.Context(), req.Name, req.Calories)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(meal)
}
