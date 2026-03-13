package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type PlannerRepository interface {
	CreatePlannerEntry(ctx context.Context, dayOfWeek string, mealType string, mealID string, userID string) (*db.PlannerModel, error)
	GetAllPlannerEntries(ctx context.Context, userID string) ([]db.PlannerModel, error)
	GetPlannerEntriesByDay(ctx context.Context, dayOfWeek string, userID string) ([]db.PlannerModel, error)
	DeletePlannerEntry(ctx context.Context, id string, userID string) (*db.PlannerModel, error)
}

type plannerRepo struct {
	repo *PrismaRepository
}

func NewPlannerRepository(repo *PrismaRepository) PlannerRepository {
	return &plannerRepo{repo: repo}
}

func (p *plannerRepo) CreatePlannerEntry(ctx context.Context, dayOfWeek string, mealType string, mealID string, userID string) (*db.PlannerModel, error) {
	return p.repo.Client.Planner.CreateOne(
		db.Planner.DayOfWeek.Set(dayOfWeek),
		db.Planner.MealType.Set(mealType),
		db.Planner.Meal.Link(
			db.Meal.ID.Equals(mealID),
		),
		db.Planner.User.Link(
			db.User.ID.Equals(userID),
		),
	).With(
		db.Planner.Meal.Fetch(),
	).Exec(ctx)
}

func (p *plannerRepo) GetAllPlannerEntries(ctx context.Context, userID string) ([]db.PlannerModel, error) {
	return p.repo.Client.Planner.FindMany(
		db.Planner.UserID.Equals(userID),
	).With(
		db.Planner.Meal.Fetch().With(
			db.Meal.Ingredients.Fetch(),
		),
	).Exec(ctx)
}

func (p *plannerRepo) GetPlannerEntriesByDay(ctx context.Context, dayOfWeek string, userID string) ([]db.PlannerModel, error) {
	return p.repo.Client.Planner.FindMany(
		db.Planner.DayOfWeek.Equals(dayOfWeek),
		db.Planner.UserID.Equals(userID),
	).With(
		db.Planner.Meal.Fetch().With(
			db.Meal.Ingredients.Fetch(),
		),
	).Exec(ctx)
}

func (p *plannerRepo) DeletePlannerEntry(ctx context.Context, id string, userID string) (*db.PlannerModel, error) {
	return p.repo.Client.Planner.FindUnique(
		db.Planner.ID.Equals(id),
	).Delete().Exec(ctx)
}
