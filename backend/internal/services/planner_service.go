package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
)

type PlannerService interface {
	AddPlannerEntry(ctx context.Context, dayOfWeek string, mealType string, mealID string, userID string) (*db.PlannerModel, error)
	GetAllEntries(ctx context.Context, userID string) ([]db.PlannerModel, error)
	GetEntriesByDay(ctx context.Context, dayOfWeek string, userID string) ([]db.PlannerModel, error)
	RemoveEntry(ctx context.Context, id string, userID string) (*db.PlannerModel, error)
}

type plannerService struct {
	repo repository.PlannerRepository
}

func NewPlannerService(repo repository.PlannerRepository) PlannerService {
	return &plannerService{repo: repo}
}

func (s *plannerService) AddPlannerEntry(ctx context.Context, dayOfWeek string, mealType string, mealID string, userID string) (*db.PlannerModel, error) {
	return s.repo.CreatePlannerEntry(ctx, dayOfWeek, mealType, mealID, userID)
}

func (s *plannerService) GetAllEntries(ctx context.Context, userID string) ([]db.PlannerModel, error) {
	return s.repo.GetAllPlannerEntries(ctx, userID)
}

func (s *plannerService) GetEntriesByDay(ctx context.Context, dayOfWeek string, userID string) ([]db.PlannerModel, error) {
	return s.repo.GetPlannerEntriesByDay(ctx, dayOfWeek, userID)
}

func (s *plannerService) RemoveEntry(ctx context.Context, id string, userID string) (*db.PlannerModel, error) {
	return s.repo.DeletePlannerEntry(ctx, id, userID)
}
