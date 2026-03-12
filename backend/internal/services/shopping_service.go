package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"time"
)

type ShoppingService interface {
	GetItems(ctx context.Context, userID string) ([]db.ShoppingItemModel, error)
	AddItem(ctx context.Context, name, category string, quantity *string, note *string, targetDate *time.Time, userID string) (*db.ShoppingItemModel, error)
	MarkAsBought(ctx context.Context, id string, userID string) (*db.ShoppingItemModel, error)
	DeleteItem(ctx context.Context, id string, userID string) (*db.ShoppingItemModel, error)
}

type shoppingService struct {
	repo repository.ShoppingRepository
}

func NewShoppingService(repo repository.ShoppingRepository) ShoppingService {
	return &shoppingService{repo: repo}
}

func (s *shoppingService) GetItems(ctx context.Context, userID string) ([]db.ShoppingItemModel, error) {
	return s.repo.GetAllItems(ctx, userID)
}

func (s *shoppingService) AddItem(ctx context.Context, name, category string, quantity *string, note *string, targetDate *time.Time, userID string) (*db.ShoppingItemModel, error) {
	if category == "" {
		category = "Other"
	}
	return s.repo.CreateItem(ctx, name, category, quantity, note, targetDate, userID)
}

func (s *shoppingService) MarkAsBought(ctx context.Context, id string, userID string) (*db.ShoppingItemModel, error) {
	return s.repo.UpdateItemStatus(ctx, id, "bought", userID)
}

func (s *shoppingService) DeleteItem(ctx context.Context, id string, userID string) (*db.ShoppingItemModel, error) {
	return s.repo.DeleteItem(ctx, id, userID)
}
