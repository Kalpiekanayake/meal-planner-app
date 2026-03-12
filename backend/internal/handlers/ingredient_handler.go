package handlers

import (
	"encoding/json"
	"meal-planner-backend/internal/services"
	"net/http"
)

type IngredientHandler struct {
	service services.IngredientService
}

func NewIngredientHandler(service services.IngredientService) *IngredientHandler {
	return &IngredientHandler{service: service}
}

func (h *IngredientHandler) GetIngredients(w http.ResponseWriter, r *http.Request) {
	ingredients, err := h.service.GetIngredients(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ingredients)
}

type createIngredientRequest struct {
	Name string `json:"name"`
}

func (h *IngredientHandler) CreateIngredient(w http.ResponseWriter, r *http.Request) {
	var req createIngredientRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	ingredient, err := h.service.AddIngredient(r.Context(), req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ingredient)
}

func (h *IngredientHandler) GetOrCreateIngredient(w http.ResponseWriter, r *http.Request) {
	var req createIngredientRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	ingredient, err := h.service.GetOrCreateIngredient(r.Context(), req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ingredient)
}

type updateIngredientAvailabilityRequest struct {
	IsAvailable bool `json:"isAvailable"`
}

func (h *IngredientHandler) UpdateAvailability(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing ingredient ID", http.StatusBadRequest)
		return
	}

	var req updateIngredientAvailabilityRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	ingredient, err := h.service.UpdateAvailability(r.Context(), id, req.IsAvailable)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ingredient)
}

func (h *IngredientHandler) DeleteIngredient(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing ingredient ID", http.StatusBadRequest)
		return
	}

	_, err := h.service.RemoveIngredient(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *IngredientHandler) LinkToMeal(w http.ResponseWriter, r *http.Request) {
	mealID := r.PathValue("mealId")
	ingredientID := r.PathValue("ingredientId")

	if mealID == "" || ingredientID == "" {
		http.Error(w, "missing meal or ingredient ID", http.StatusBadRequest)
		return
	}

	meal, err := h.service.LinkToMeal(r.Context(), mealID, ingredientID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meal)
}
