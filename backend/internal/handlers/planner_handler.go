package handlers

import (
	"encoding/json"
	"meal-planner-backend/internal/services"
	"net/http"
)

type PlannerHandler struct {
	service services.PlannerService
}

func NewPlannerHandler(service services.PlannerService) *PlannerHandler {
	return &PlannerHandler{service: service}
}

type createPlannerRequest struct {
	DayOfWeek string `json:"dayOfWeek"`
	MealType  string `json:"mealType"`
	MealID    string `json:"mealId"`
}

func (h *PlannerHandler) CreatePlannerEntry(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	var req createPlannerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	entry, err := h.service.AddPlannerEntry(r.Context(), req.DayOfWeek, req.MealType, req.MealID, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(entry)
}

func (h *PlannerHandler) GetAllEntries(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		// Return empty list for guests
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]"))
		return
	}

	entries, err := h.service.GetAllEntries(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(entries)
}

func (h *PlannerHandler) GetEntriesByDay(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		// Return empty list for guests
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]"))
		return
	}

	day := r.PathValue("dayOfWeek")
	if day == "" {
		http.Error(w, "missing day of week", http.StatusBadRequest)
		return
	}

	entries, err := h.service.GetEntriesByDay(r.Context(), day, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(entries)
}

func (h *PlannerHandler) DeleteEntry(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing entry ID", http.StatusBadRequest)
		return
	}

	_, err := h.service.RemoveEntry(r.Context(), id, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
