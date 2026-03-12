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

func (h *MealHandler) GetMealByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing meal ID", http.StatusBadRequest)
		return
	}

	meal, err := h.service.GetMealByID(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if meal == nil {
		http.Error(w, "meal not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meal)
}

type createMealRequest struct {
	Name string `json:"name"`
}

func (h *MealHandler) CreateMeal(w http.ResponseWriter, r *http.Request) {
	var req createMealRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	meal, err := h.service.AddMeal(r.Context(), req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(meal)
}

func (h *MealHandler) GetOrCreateMeal(w http.ResponseWriter, r *http.Request) {
	var req createMealRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	meal, err := h.service.GetOrCreateMeal(r.Context(), req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meal)
}

func (h *MealHandler) DeleteMeal(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing meal ID", http.StatusBadRequest)
		return
	}

	_, err := h.service.RemoveMeal(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
