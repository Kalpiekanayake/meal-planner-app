package handlers

import (
	"encoding/json"
	"meal-planner-backend/internal/services"
	"net/http"
)

type NotificationHandler struct {
	service services.NotificationService
}

func NewNotificationHandler(service services.NotificationService) *NotificationHandler {
	return &NotificationHandler{
		service: service,
	}
}

func (h *NotificationHandler) Generate(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	err := h.service.GenerateNotifications(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Notifications generated"))
}

func (h *NotificationHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		// Return empty list for guests
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]"))
		return
	}

	notifications, err := h.service.GetNotifications(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
}

func (h *NotificationHandler) MarkAsRead(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing notification ID", http.StatusBadRequest)
		return
	}

	notification, err := h.service.MarkAsRead(r.Context(), id, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notification)
}

func (h *NotificationHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok || userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing notification ID", http.StatusBadRequest)
		return
	}

	_, err := h.service.RemoveNotification(r.Context(), id, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
