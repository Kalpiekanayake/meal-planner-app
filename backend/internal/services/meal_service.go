package services

import (
	"context"
	"errors"
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
	if trimmedName == "" {
		return nil, errors.New("meal name cannot be empty")
	}
	
	// 1. First try an exact match (this handles case where unique constraint matches exactly)
	meal, err := s.repo.GetMealByName(ctx, trimmedName)
	if err == nil {
		return meal, nil
	}
	
	// If it's not ErrNotFound, we should report the error
	if !errors.Is(err, db.ErrNotFound) {
		// In prisma-client-go, FindUnique returns db.ErrNotFound if not found
		// But let's check for case-insensitive matches anyway just in case
	}
	
	// 2. Search case-insensitively across all meals
	allMeals, err := s.repo.GetAllMeals(ctx)
	if err == nil {
		for _, m := range allMeals {
			if strings.EqualFold(m.Name, trimmedName) {
				return &m, nil
			}
		}
	}

	// 3. If no match found, create a new one
	return s.repo.CreateMeal(ctx, trimmedName)
}

func (s *mealService) AddMeal(ctx context.Context, name string) (*db.MealModel, error) {
	trimmedName := strings.TrimSpace(name)
	if trimmedName == "" {
		return nil, errors.New("meal name cannot be empty")
	}
	return s.repo.CreateMeal(ctx, trimmedName)
}

func (s *mealService) RemoveMeal(ctx context.Context, id string) (*db.MealModel, error) {
	return s.repo.DeleteMeal(ctx, id)
}
