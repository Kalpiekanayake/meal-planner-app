package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
	"time"
)

type ShoppingRepository interface {
	GetAllItems(ctx context.Context, userID string) ([]db.ShoppingItemModel, error)
	GetItemByID(ctx context.Context, id string, userID string) (*db.ShoppingItemModel, error)
	CreateItem(ctx context.Context, name, category string, quantity *string, note *string, targetDate *time.Time, userID string) (*db.ShoppingItemModel, error)
	UpdateItemStatus(ctx context.Context, id string, status string, userID string) (*db.ShoppingItemModel, error)
	DeleteItem(ctx context.Context, id string, userID string) (*db.ShoppingItemModel, error)
}

type shoppingRepo struct {
	repo *PrismaRepository
}

func NewShoppingRepository(repo *PrismaRepository) ShoppingRepository {
	return &shoppingRepo{repo: repo}
}

func (s *shoppingRepo) GetAllItems(ctx context.Context, userID string) ([]db.ShoppingItemModel, error) {
	return s.repo.Client.ShoppingItem.FindMany(
		db.ShoppingItem.UserID.Equals(userID),
	).OrderBy(
		db.ShoppingItem.Category.Order(db.SortOrderAsc),
		db.ShoppingItem.CreatedAt.Order(db.SortOrderDesc),
	).Exec(ctx)
}

func (s *shoppingRepo) GetItemByID(ctx context.Context, id string, userID string) (*db.ShoppingItemModel, error) {
	return s.repo.Client.ShoppingItem.FindUnique(
		db.ShoppingItem.ID.Equals(id),
	).Exec(ctx)
}

func (s *shoppingRepo) CreateItem(ctx context.Context, name, category string, quantity *string, note *string, targetDate *time.Time, userID string) (*db.ShoppingItemModel, error) {
	optional := []db.ShoppingItemSetParam{
		db.ShoppingItem.Category.Set(category),
	}
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
		db.ShoppingItem.User.Link(
			db.User.ID.Equals(userID),
		),
		optional...,
	).Exec(ctx)
}

func (s *shoppingRepo) UpdateItemStatus(ctx context.Context, id string, status string, userID string) (*db.ShoppingItemModel, error) {
	return s.repo.Client.ShoppingItem.FindUnique(
		db.ShoppingItem.ID.Equals(id),
	).Update(
		db.ShoppingItem.Status.Set(status),
	).Exec(ctx)
}

func (s *shoppingRepo) DeleteItem(ctx context.Context, id string, userID string) (*db.ShoppingItemModel, error) {
	return s.repo.Client.ShoppingItem.FindUnique(
		db.ShoppingItem.ID.Equals(id),
	).Delete().Exec(ctx)
}
