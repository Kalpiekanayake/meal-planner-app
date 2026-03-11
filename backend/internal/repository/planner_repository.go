package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type PlannerRepository interface {
	CreatePlannerEntry(ctx context.Context, dayOfWeek string, mealType string, mealID string) (*db.PlannerModel, error)
	GetAllPlannerEntries(ctx context.Context) ([]db.PlannerModel, error)
	GetPlannerEntriesByDay(ctx context.Context, dayOfWeek string) ([]db.PlannerModel, error)
	DeletePlannerEntry(ctx context.Context, id string) (*db.PlannerModel, error)
}

type plannerRepo struct {
	repo *PrismaRepository
}

func NewPlannerRepository(repo *PrismaRepository) PlannerRepository {
	return &plannerRepo{repo: repo}
}

func (r *plannerRepo) CreatePlannerEntry(ctx context.Context, dayOfWeek string, mealType string, mealID string) (*db.PlannerModel, error) {
	return r.repo.Client.Planner.CreateOne(
		db.Planner.DayOfWeek.Set(dayOfWeek),
		db.Planner.MealType.Set(mealType),
		db.Planner.Meal.Link(
			db.Meal.ID.Equals(mealID),
		),
	).Exec(ctx)
}

func (r *plannerRepo) GetAllPlannerEntries(ctx context.Context) ([]db.PlannerModel, error) {
	return r.repo.Client.Planner.FindMany().With(
		db.Planner.Meal.Fetch(),
	).Exec(ctx)
}

func (r *plannerRepo) GetPlannerEntriesByDay(ctx context.Context, dayOfWeek string) ([]db.PlannerModel, error) {
	return r.repo.Client.Planner.FindMany(
		db.Planner.DayOfWeek.Equals(dayOfWeek),
	).With(
		db.Planner.Meal.Fetch(),
	).Exec(ctx)
}

func (r *plannerRepo) DeletePlannerEntry(ctx context.Context, id string) (*db.PlannerModel, error) {
	return r.repo.Client.Planner.FindUnique(
		db.Planner.ID.Equals(id),
	).Delete().Exec(ctx)
}
