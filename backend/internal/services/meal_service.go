package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"strings"
)

type MealService interface {
	GetMeals(ctx context.Context) ([]db.MealModel, error)
	GetMealByID(ctx context.Context, id string) (*db.MealModel, error)
	GetOrCreateMeal(ctx context.Context, name string) (*db.MealModel, error)
	AddMeal(ctx context.Context, name string) (*db.MealModel, error)
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

func (s *mealService) GetOrCreateMeal(ctx context.Context, name string) (*db.MealModel, error) {
	trimmedName := strings.TrimSpace(name)
	
	// Case-insensitive check by fetching all and comparing (since FindUnique is case-sensitive usually)
	// Alternatively, we can assume exact match for now as per simple DB rules.
	// But let's try to find exact match first.
	meal, err := s.repo.GetMealByName(ctx, trimmedName)
	if err == nil && meal != nil {
		return meal, nil
	}
	
	// If not found, try searching case-insensitively across all meals
	// To keep it simple and efficient for small apps:
	allMeals, err := s.repo.GetAllMeals(ctx)
	if err == nil {
		for _, m := range allMeals {
			if strings.EqualFold(m.Name, trimmedName) {
				return &m, nil
			}
		}
	}

	return s.repo.CreateMeal(ctx, trimmedName)
}

func (s *mealService) AddMeal(ctx context.Context, name string) (*db.MealModel, error) {
	return s.repo.CreateMeal(ctx, strings.TrimSpace(name))
}

func (s *mealService) RemoveMeal(ctx context.Context, id string) (*db.MealModel, error) {
	return s.repo.DeleteMeal(ctx, id)
}
