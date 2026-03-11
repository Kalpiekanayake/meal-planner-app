package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type MealRepository interface {
	GetAllMeals(ctx context.Context) ([]db.MealModel, error)
	CreateMeal(ctx context.Context, name string, calories int) (*db.MealModel, error)
}

type mealRepo struct {
	repo *PrismaRepository
}

func NewMealRepository(repo *PrismaRepository) MealRepository {
	return &mealRepo{repo: repo}
}

func (m *mealRepo) GetAllMeals(ctx context.Context) ([]db.MealModel, error) {
	return m.repo.Client.Meal.FindMany().Exec(ctx)
}

func (m *mealRepo) CreateMeal(ctx context.Context, name string, calories int) (*db.MealModel, error) {
	return m.repo.Client.Meal.CreateOne(
		db.Meal.Name.Set(name),
		db.Meal.Calories.Set(calories),
	).Exec(ctx)
}
