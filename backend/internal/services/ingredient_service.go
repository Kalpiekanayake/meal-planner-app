package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"strings"
)

type IngredientService interface {
	AddIngredient(ctx context.Context, name, category, quantity, unit, userID string) (*db.IngredientModel, error)
	GetIngredients(ctx context.Context, userID string) ([]db.IngredientModel, error)
	GetOrCreateIngredient(ctx context.Context, name, userID string) (*db.IngredientModel, error)
	RemoveIngredient(ctx context.Context, id string, userID string) (*db.IngredientModel, error)
	LinkToMeal(ctx context.Context, mealID string, ingredientID string, userID string) (*db.MealModel, error)
	UpdateAvailability(ctx context.Context, id string, isAvailable bool, userID string) (*db.IngredientModel, error)
}

type ingredientService struct {
	repo repository.IngredientRepository
}

func NewIngredientService(repo repository.IngredientRepository) IngredientService {
	return &ingredientService{repo: repo}
}

func (s *ingredientService) AddIngredient(ctx context.Context, name, category, quantity, unit, userID string) (*db.IngredientModel, error) {
	if category == "" {
		category = "Other"
	}
	return s.repo.CreateIngredient(ctx, strings.TrimSpace(name), category, quantity, unit, userID)
}

func (s *ingredientService) GetIngredients(ctx context.Context, userID string) ([]db.IngredientModel, error) {
	return s.repo.GetAllIngredients(ctx, userID)
}

func (s *ingredientService) GetOrCreateIngredient(ctx context.Context, name, userID string) (*db.IngredientModel, error) {
	trimmedName := strings.TrimSpace(name)
	
	ing, err := s.repo.GetIngredientByName(ctx, trimmedName, userID)
	if err == nil && ing != nil {
		return ing, nil
	}
	
	all, err := s.repo.GetAllIngredients(ctx, userID)
	if err == nil {
		for _, i := range all {
			if strings.EqualFold(i.Name, trimmedName) {
				return &i, nil
			}
		}
	}
	
	return s.repo.CreateIngredient(ctx, trimmedName, "Other", "", "", userID)
}

func (s *ingredientService) RemoveIngredient(ctx context.Context, id string, userID string) (*db.IngredientModel, error) {
	return s.repo.DeleteIngredient(ctx, id, userID)
}

func (s *ingredientService) LinkToMeal(ctx context.Context, mealID string, ingredientID string, userID string) (*db.MealModel, error) {
	return s.repo.AddIngredientToMeal(ctx, mealID, ingredientID, userID)
}

func (s *ingredientService) UpdateAvailability(ctx context.Context, id string, isAvailable bool, userID string) (*db.IngredientModel, error) {
	return s.repo.UpdateIngredientAvailability(ctx, id, isAvailable, userID)
}
