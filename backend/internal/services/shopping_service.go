package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"time"
)

type ShoppingService interface {
	GetItems(ctx context.Context) ([]db.ShoppingItemModel, error)
	AddItem(ctx context.Context, name string, quantity *string, note *string, targetDate *time.Time) (*db.ShoppingItemModel, error)
	MarkAsBought(ctx context.Context, id string) (*db.ShoppingItemModel, error)
	DeleteItem(ctx context.Context, id string) (*db.ShoppingItemModel, error)
}

type shoppingService struct {
	repo repository.ShoppingRepository
}

func NewShoppingService(repo repository.ShoppingRepository) ShoppingService {
	return &shoppingService{repo: repo}
}

func (s *shoppingService) GetItems(ctx context.Context) ([]db.ShoppingItemModel, error) {
	return s.repo.GetAllItems(ctx)
}

func (s *shoppingService) AddItem(ctx context.Context, name string, quantity *string, note *string, targetDate *time.Time) (*db.ShoppingItemModel, error) {
	return s.repo.CreateItem(ctx, name, quantity, note, targetDate)
}

func (s *shoppingService) MarkAsBought(ctx context.Context, id string) (*db.ShoppingItemModel, error) {
	return s.repo.UpdateItemStatus(ctx, id, "bought")
}

func (s *shoppingService) DeleteItem(ctx context.Context, id string) (*db.ShoppingItemModel, error) {
	return s.repo.DeleteItem(ctx, id)
}
