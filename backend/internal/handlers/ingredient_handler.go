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
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		// Return empty list for guests
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]"))
		return
	}

	ingredients, err := h.service.GetIngredients(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ingredients)
}

type createIngredientRequest struct {
	Name     string `json:"name"`
	Category string `json:"category"`
	Quantity string `json:"quantity"`
	Unit     string `json:"unit"`
}

func (h *IngredientHandler) CreateIngredient(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	var req createIngredientRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	ingredient, err := h.service.AddIngredient(r.Context(), req.Name, req.Category, req.Quantity, req.Unit, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ingredient)
}

func (h *IngredientHandler) GetOrCreateIngredient(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	var req createIngredientRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	ingredient, err := h.service.GetOrCreateIngredient(r.Context(), req.Name, userID)
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
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

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

	ingredient, err := h.service.UpdateAvailability(r.Context(), id, req.IsAvailable, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ingredient)
}

func (h *IngredientHandler) DeleteIngredient(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing ingredient ID", http.StatusBadRequest)
		return
	}

	_, err := h.service.RemoveIngredient(r.Context(), id, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *IngredientHandler) LinkToMeal(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	mealID := r.PathValue("mealId")
	ingredientID := r.PathValue("ingredientId")

	if mealID == "" || ingredientID == "" {
		http.Error(w, "missing meal or ingredient ID", http.StatusBadRequest)
		return
	}

	meal, err := h.service.LinkToMeal(r.Context(), mealID, ingredientID, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meal)
}
