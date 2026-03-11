package handlers

import (
	"encoding/json"
	"meal-planner-backend/internal/services"
	"net/http"
)

type NotificationHandler struct {
	service           services.NotificationService
	ingredientService services.IngredientService
}

func NewNotificationHandler(service services.NotificationService, ingredientService services.IngredientService) *NotificationHandler {
	return &NotificationHandler{
		service:           service,
		ingredientService: ingredientService,
	}
}

func (h *NotificationHandler) Generate(w http.ResponseWriter, r *http.Request) {
	err := h.service.GenerateNotifications(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Notifications generated"))
}

func (h *NotificationHandler) List(w http.ResponseWriter, r *http.Request) {
	notifications, err := h.service.GetNotifications(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
}

func (h *NotificationHandler) GetByDay(w http.ResponseWriter, r *http.Request) {
	day := r.PathValue("dayOfWeek")
	if day == "" {
		http.Error(w, "missing day of week", http.StatusBadRequest)
		return
	}

	notifications, err := h.service.GetNotificationsByDay(r.Context(), day)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
}

func (h *NotificationHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing notification ID", http.StatusBadRequest)
		return
	}

	_, err := h.service.RemoveNotification(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Extra: API to update ingredient availability
type updateAvailabilityRequest struct {
	IsAvailable bool `json:"isAvailable"`
}

func (h *NotificationHandler) UpdateIngredientAvailability(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing ingredient ID", http.StatusBadRequest)
		return
	}

	var req updateAvailabilityRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	ingredient, err := h.ingredientService.UpdateAvailability(r.Context(), id, req.IsAvailable)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ingredient)
}
