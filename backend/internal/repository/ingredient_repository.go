package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type IngredientRepository interface {
	CreateIngredient(ctx context.Context, name, category, quantity, unit, userID string) (*db.IngredientModel, error)
	GetIngredientByName(ctx context.Context, name string, userID string) (*db.IngredientModel, error)
	GetAllIngredients(ctx context.Context, userID string) ([]db.IngredientModel, error)
	DeleteIngredient(ctx context.Context, id string, userID string) (*db.IngredientModel, error)
	AddIngredientToMeal(ctx context.Context, mealID string, ingredientID string, userID string) (*db.MealModel, error)
	UpdateIngredientAvailability(ctx context.Context, id string, isAvailable bool, userID string) (*db.IngredientModel, error)
}

type ingredientRepo struct {
	repo *PrismaRepository
}

func NewIngredientRepository(repo *PrismaRepository) IngredientRepository {
	return &ingredientRepo{repo: repo}
}

func (r *ingredientRepo) CreateIngredient(ctx context.Context, name, category, quantity, unit, userID string) (*db.IngredientModel, error) {
	return r.repo.Client.Ingredient.CreateOne(
		db.Ingredient.Name.Set(name),
		db.Ingredient.User.Link(
			db.User.ID.Equals(userID),
		),
		db.Ingredient.Category.Set(category),
		db.Ingredient.Quantity.Set(quantity),
		db.Ingredient.Unit.Set(unit),
	).Exec(ctx)
}

func (r *ingredientRepo) GetIngredientByName(ctx context.Context, name string, userID string) (*db.IngredientModel, error) {
	return r.repo.Client.Ingredient.FindUnique(
		db.Ingredient.NameUserID(db.Ingredient.Name.Equals(name), db.Ingredient.UserID.Equals(userID)),
	).Exec(ctx)
}

func (r *ingredientRepo) GetAllIngredients(ctx context.Context, userID string) ([]db.IngredientModel, error) {
	return r.repo.Client.Ingredient.FindMany(
		db.Ingredient.UserID.Equals(userID),
	).OrderBy(
		db.Ingredient.Category.Order(db.SortOrderAsc),
		db.Ingredient.Name.Order(db.SortOrderAsc),
	).Exec(ctx)
}

func (r *ingredientRepo) DeleteIngredient(ctx context.Context, id string, userID string) (*db.IngredientModel, error) {
	return r.repo.Client.Ingredient.FindUnique(
		db.Ingredient.ID.Equals(id),
	).Delete().Exec(ctx)
}

func (r *ingredientRepo) AddIngredientToMeal(ctx context.Context, mealID string, ingredientID string, userID string) (*db.MealModel, error) {
	return r.repo.Client.Meal.FindUnique(
		db.Meal.ID.Equals(mealID),
	).Update(
		db.Meal.Ingredients.Link(
			db.Ingredient.ID.Equals(ingredientID),
		),
	).Exec(ctx)
}

func (r *ingredientRepo) UpdateIngredientAvailability(ctx context.Context, id string, isAvailable bool, userID string) (*db.IngredientModel, error) {
	return r.repo.Client.Ingredient.FindUnique(
		db.Ingredient.ID.Equals(id),
	).Update(
		db.Ingredient.IsAvailable.Set(isAvailable),
	).Exec(ctx)
}
