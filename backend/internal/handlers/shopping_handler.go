package handlers

import (
	"encoding/json"
	"meal-planner-backend/internal/services"
	"net/http"
	"time"
)

type ShoppingHandler struct {
	service services.ShoppingService
}

func NewShoppingHandler(service services.ShoppingService) *ShoppingHandler {
	return &ShoppingHandler{service: service}
}

func (h *ShoppingHandler) GetItems(w http.ResponseWriter, r *http.Request) {
	items, err := h.service.GetItems(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

type createShoppingItemRequest struct {
	Name       string     `json:"name"`
	Quantity   *string    `json:"quantity"`
	Note       *string    `json:"note"`
	TargetDate *time.Time `json:"targetDate"`
}

func (h *ShoppingHandler) CreateItem(w http.ResponseWriter, r *http.Request) {
	var req createShoppingItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	item, err := h.service.AddItem(r.Context(), req.Name, req.Quantity, req.Note, req.TargetDate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(item)
}

func (h *ShoppingHandler) MarkAsBought(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing item ID", http.StatusBadRequest)
		return
	}

	item, err := h.service.MarkAsBought(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func (h *ShoppingHandler) DeleteItem(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing item ID", http.StatusBadRequest)
		return
	}

	_, err := h.service.DeleteItem(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
