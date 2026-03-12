package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
	"time"
)

type ShoppingRepository interface {
	GetAllItems(ctx context.Context) ([]db.ShoppingItemModel, error)
	GetItemByID(ctx context.Context, id string) (*db.ShoppingItemModel, error)
	CreateItem(ctx context.Context, name string, quantity *string, note *string, targetDate *time.Time) (*db.ShoppingItemModel, error)
	UpdateItemStatus(ctx context.Context, id string, status string) (*db.ShoppingItemModel, error)
	DeleteItem(ctx context.Context, id string) (*db.ShoppingItemModel, error)
}

type shoppingRepo struct {
	repo *PrismaRepository
}

func NewShoppingRepository(repo *PrismaRepository) ShoppingRepository {
	return &shoppingRepo{repo: repo}
}

func (s *shoppingRepo) GetAllItems(ctx context.Context) ([]db.ShoppingItemModel, error) {
	return s.repo.Client.ShoppingItem.FindMany().OrderBy(
		db.ShoppingItem.CreatedAt.Order(db.SortOrderDesc),
	).Exec(ctx)
}

func (s *shoppingRepo) GetItemByID(ctx context.Context, id string) (*db.ShoppingItemModel, error) {
	return s.repo.Client.ShoppingItem.FindUnique(
		db.ShoppingItem.ID.Equals(id),
	).Exec(ctx)
}

func (s *shoppingRepo) CreateItem(ctx context.Context, name string, quantity *string, note *string, targetDate *time.Time) (*db.ShoppingItemModel, error) {
	var optional []db.ShoppingItemSetParam
	if quantity != nil {
		optional = append(optional, db.ShoppingItem.Quantity.Set(*quantity))
	}
	if note != nil {
		optional = append(optional, db.ShoppingItem.Note.Set(*note))
	}
	if targetDate != nil {
		optional = append(optional, db.ShoppingItem.TargetDate.Set(*targetDate))
	}

	return s.repo.Client.ShoppingItem.CreateOne(
		db.ShoppingItem.Name.Set(name),
		optional...,
	).Exec(ctx)
}

func (s *shoppingRepo) UpdateItemStatus(ctx context.Context, id string, status string) (*db.ShoppingItemModel, error) {
	return s.repo.Client.ShoppingItem.FindUnique(
		db.ShoppingItem.ID.Equals(id),
	).Update(
		db.ShoppingItem.Status.Set(status),
	).Exec(ctx)
}

func (s *shoppingRepo) DeleteItem(ctx context.Context, id string) (*db.ShoppingItemModel, error) {
	return s.repo.Client.ShoppingItem.FindUnique(
		db.ShoppingItem.ID.Equals(id),
	).Delete().Exec(ctx)
}
