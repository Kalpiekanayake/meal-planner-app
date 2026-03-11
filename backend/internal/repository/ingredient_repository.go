package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type IngredientRepository interface {
	CreateIngredient(ctx context.Context, name string) (*db.IngredientModel, error)
	GetAllIngredients(ctx context.Context) ([]db.IngredientModel, error)
	DeleteIngredient(ctx context.Context, id string) (*db.IngredientModel, error)
	AddIngredientToMeal(ctx context.Context, mealID string, ingredientID string) (*db.MealModel, error)
	UpdateIngredientAvailability(ctx context.Context, id string, isAvailable bool) (*db.IngredientModel, error)
}

func (r *ingredientRepo) UpdateIngredientAvailability(ctx context.Context, id string, isAvailable bool) (*db.IngredientModel, error) {
	return r.repo.Client.Ingredient.FindUnique(
		db.Ingredient.ID.Equals(id),
	).Update(
		db.Ingredient.IsAvailable.Set(isAvailable),
	).Exec(ctx)
}

type ingredientRepo struct {
	repo *PrismaRepository
}

func NewIngredientRepository(repo *PrismaRepository) IngredientRepository {
	return &ingredientRepo{repo: repo}
}

func (r *ingredientRepo) CreateIngredient(ctx context.Context, name string) (*db.IngredientModel, error) {
	return r.repo.Client.Ingredient.CreateOne(
		db.Ingredient.Name.Set(name),
	).Exec(ctx)
}

func (r *ingredientRepo) GetAllIngredients(ctx context.Context) ([]db.IngredientModel, error) {
	return r.repo.Client.Ingredient.FindMany().Exec(ctx)
}

func (r *ingredientRepo) DeleteIngredient(ctx context.Context, id string) (*db.IngredientModel, error) {
	return r.repo.Client.Ingredient.FindUnique(
		db.Ingredient.ID.Equals(id),
	).Delete().Exec(ctx)
}

func (r *ingredientRepo) AddIngredientToMeal(ctx context.Context, mealID string, ingredientID string) (*db.MealModel, error) {
	return r.repo.Client.Meal.FindUnique(
		db.Meal.ID.Equals(mealID),
	).Update(
		db.Meal.Ingredients.Link(
			db.Ingredient.ID.Equals(ingredientID),
		),
	).Exec(ctx)
}
