package services

import (
	"context"
	"errors"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"strings"
)

type MealService interface {
	GetMeals(ctx context.Context, userID string) ([]db.MealModel, error)
	GetMealByID(ctx context.Context, id string, userID string) (*db.MealModel, error)
	GetOrCreateMeal(ctx context.Context, name string, userID string) (*db.MealModel, error)
	AddMeal(ctx context.Context, name string, userID string) (*db.MealModel, error)
	RemoveMeal(ctx context.Context, id string, userID string) (*db.MealModel, error)
}

type mealService struct {
	repo repository.MealRepository
}

func NewMealService(repo repository.MealRepository) MealService {
	return &mealService{repo: repo}
}

func (s *mealService) GetMeals(ctx context.Context, userID string) ([]db.MealModel, error) {
	return s.repo.GetAllMeals(ctx, userID)
}

func (s *mealService) GetMealByID(ctx context.Context, id string, userID string) (*db.MealModel, error) {
	return s.repo.GetMealByID(ctx, id, userID)
}

func (s *mealService) GetOrCreateMeal(ctx context.Context, name string, userID string) (*db.MealModel, error) {
	trimmedName := strings.TrimSpace(name)
	if trimmedName == "" {
		return nil, errors.New("meal name cannot be empty")
	}
	
	meal, err := s.repo.GetMealByName(ctx, trimmedName, userID)
	if err == nil && meal != nil {
		return meal, nil
	}
	
	allMeals, err := s.repo.GetAllMeals(ctx, userID)
	if err == nil {
		for _, m := range allMeals {
			if strings.EqualFold(m.Name, trimmedName) {
				return &m, nil
			}
		}
	}

	return s.repo.CreateMeal(ctx, trimmedName, userID)
}

func (s *mealService) AddMeal(ctx context.Context, name string, userID string) (*db.MealModel, error) {
	trimmedName := strings.TrimSpace(name)
	if trimmedName == "" {
		return nil, errors.New("meal name cannot be empty")
	}
	return s.repo.CreateMeal(ctx, trimmedName, userID)
}

func (s *mealService) RemoveMeal(ctx context.Context, id string, userID string) (*db.MealModel, error) {
	return s.repo.DeleteMeal(ctx, id, userID)
}
