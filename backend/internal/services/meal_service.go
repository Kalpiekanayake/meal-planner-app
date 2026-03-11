package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
)

type MealService interface {
	GetMeals(ctx context.Context) ([]db.MealModel, error)
	AddMeal(ctx context.Context, name string, calories int) (*db.MealModel, error)
}

type mealService struct {
	repo repository.MealRepository
}

func NewMealService(repo repository.MealRepository) MealService {
	return &mealService{repo: repo}
}

func (s *mealService) GetMeals(ctx context.Context) ([]db.MealModel, error) {
	return s.repo.GetAllMeals(ctx)
}

func (s *mealService) AddMeal(ctx context.Context, name string, calories int) (*db.MealModel, error) {
	return s.repo.CreateMeal(ctx, name, calories)
}
