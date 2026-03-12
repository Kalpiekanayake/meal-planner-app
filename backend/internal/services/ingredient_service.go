package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"strings"
)

type IngredientService interface {
	AddIngredient(ctx context.Context, name string) (*db.IngredientModel, error)
	GetIngredients(ctx context.Context) ([]db.IngredientModel, error)
	GetOrCreateIngredient(ctx context.Context, name string) (*db.IngredientModel, error)
	RemoveIngredient(ctx context.Context, id string) (*db.IngredientModel, error)
	LinkToMeal(ctx context.Context, mealID string, ingredientID string) (*db.MealModel, error)
	UpdateAvailability(ctx context.Context, id string, isAvailable bool) (*db.IngredientModel, error)
}

type ingredientService struct {
	repo repository.IngredientRepository
}

func NewIngredientService(repo repository.IngredientRepository) IngredientService {
	return &ingredientService{repo: repo}
}

func (s *ingredientService) AddIngredient(ctx context.Context, name string) (*db.IngredientModel, error) {
	return s.repo.CreateIngredient(ctx, strings.TrimSpace(name))
}

func (s *ingredientService) GetIngredients(ctx context.Context) ([]db.IngredientModel, error) {
	return s.repo.GetAllIngredients(ctx)
}

func (s *ingredientService) GetOrCreateIngredient(ctx context.Context, name string) (*db.IngredientModel, error) {
	trimmedName := strings.TrimSpace(name)
	
	// 1. Try exact match
	ing, err := s.repo.GetIngredientByName(ctx, trimmedName)
	if err == nil && ing != nil {
		return ing, nil
	}
	
	// 2. Try case-insensitive match across all
	all, err := s.repo.GetAllIngredients(ctx)
	if err == nil {
		for _, i := range all {
			if strings.EqualFold(i.Name, trimmedName) {
				return &i, nil
			}
		}
	}
	
	// 3. Create new
	return s.repo.CreateIngredient(ctx, trimmedName)
}

func (s *ingredientService) RemoveIngredient(ctx context.Context, id string) (*db.IngredientModel, error) {
	return s.repo.DeleteIngredient(ctx, id)
}

func (s *ingredientService) LinkToMeal(ctx context.Context, mealID string, ingredientID string) (*db.MealModel, error) {
	return s.repo.AddIngredientToMeal(ctx, mealID, ingredientID)
}

func (s *ingredientService) UpdateAvailability(ctx context.Context, id string, isAvailable bool) (*db.IngredientModel, error) {
	return s.repo.UpdateIngredientAvailability(ctx, id, isAvailable)
}
