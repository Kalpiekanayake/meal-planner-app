package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
)

type IngredientService interface {
	AddIngredient(ctx context.Context, name string) (*db.IngredientModel, error)
	GetIngredients(ctx context.Context) ([]db.IngredientModel, error)
	RemoveIngredient(ctx context.Context, id string) (*db.IngredientModel, error)
	LinkToMeal(ctx context.Context, mealID string, ingredientID string) (*db.MealModel, error)
	UpdateAvailability(ctx context.Context, id string, isAvailable bool) (*db.IngredientModel, error)
}

func (s *ingredientService) UpdateAvailability(ctx context.Context, id string, isAvailable bool) (*db.IngredientModel, error) {
	return s.repo.UpdateIngredientAvailability(ctx, id, isAvailable)
}

type ingredientService struct {
	repo repository.IngredientRepository
}

func NewIngredientService(repo repository.IngredientRepository) IngredientService {
	return &ingredientService{repo: repo}
}

func (s *ingredientService) AddIngredient(ctx context.Context, name string) (*db.IngredientModel, error) {
	return s.repo.CreateIngredient(ctx, name)
}

func (s *ingredientService) GetIngredients(ctx context.Context) ([]db.IngredientModel, error) {
	return s.repo.GetAllIngredients(ctx)
}

func (s *ingredientService) RemoveIngredient(ctx context.Context, id string) (*db.IngredientModel, error) {
	return s.repo.DeleteIngredient(ctx, id)
}

func (s *ingredientService) LinkToMeal(ctx context.Context, mealID string, ingredientID string) (*db.MealModel, error) {
	return s.repo.AddIngredientToMeal(ctx, mealID, ingredientID)
}
