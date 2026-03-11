package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
)

type MealService interface {
	GetMeals(ctx context.Context) ([]db.MealModel, error)
	GetMealByID(ctx context.Context, id string) (*db.MealModel, error)
	AddMeal(ctx context.Context, name string, description string) (*db.MealModel, error)
	RemoveMeal(ctx context.Context, id string) (*db.MealModel, error)
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

func (s *mealService) GetMealByID(ctx context.Context, id string) (*db.MealModel, error) {
	return s.repo.GetMealByID(ctx, id)
}

func (s *mealService) AddMeal(ctx context.Context, name string, description string) (*db.MealModel, error) {
	return s.repo.CreateMeal(ctx, name, description)
}

func (s *mealService) RemoveMeal(ctx context.Context, id string) (*db.MealModel, error) {
	return s.repo.DeleteMeal(ctx, id)
}
