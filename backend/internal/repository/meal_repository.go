package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type MealRepository interface {
	GetAllMeals(ctx context.Context) ([]db.MealModel, error)
	GetMealByID(ctx context.Context, id string) (*db.MealModel, error)
	CreateMeal(ctx context.Context, name string) (*db.MealModel, error)
	DeleteMeal(ctx context.Context, id string) (*db.MealModel, error)
}

type mealRepo struct {
	repo *PrismaRepository
}

func NewMealRepository(repo *PrismaRepository) MealRepository {
	return &mealRepo{repo: repo}
}

func (m *mealRepo) GetAllMeals(ctx context.Context) ([]db.MealModel, error) {
	return m.repo.Client.Meal.FindMany().With(
		db.Meal.Ingredients.Fetch(),
	).Exec(ctx)
}

func (m *mealRepo) GetMealByID(ctx context.Context, id string) (*db.MealModel, error) {
	return m.repo.Client.Meal.FindUnique(
		db.Meal.ID.Equals(id),
	).With(
		db.Meal.Ingredients.Fetch(),
	).Exec(ctx)
}

func (m *mealRepo) CreateMeal(ctx context.Context, name string) (*db.MealModel, error) {
	return m.repo.Client.Meal.CreateOne(
		db.Meal.Name.Set(name),
	).Exec(ctx)
}

func (m *mealRepo) DeleteMeal(ctx context.Context, id string) (*db.MealModel, error) {
	return m.repo.Client.Meal.FindUnique(
		db.Meal.ID.Equals(id),
	).Delete().Exec(ctx)
}
