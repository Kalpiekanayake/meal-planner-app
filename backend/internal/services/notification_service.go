package services

import (
	"context"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"strings"
)

type NotificationService interface {
	GenerateNotifications(ctx context.Context) error
	GetNotifications(ctx context.Context) ([]db.NotificationModel, error)
	GetNotificationsByDay(ctx context.Context, dayOfWeek string) ([]db.NotificationModel, error)
	RemoveNotification(ctx context.Context, id string) (*db.NotificationModel, error)
}

type notificationService struct {
	notifyRepo  repository.NotificationRepository
	plannerRepo repository.PlannerRepository
	mealRepo    repository.MealRepository
	client      *db.PrismaClient
}

func NewNotificationService(
	notifyRepo repository.NotificationRepository,
	plannerRepo repository.PlannerRepository,
	mealRepo repository.MealRepository,
	client *db.PrismaClient,
) NotificationService {
	return &notificationService{
		notifyRepo:  notifyRepo,
		plannerRepo: plannerRepo,
		mealRepo:    mealRepo,
		client:      client,
	}
}

func (s *notificationService) GenerateNotifications(ctx context.Context) error {
	// 1. Clear old notifications
	_, err := s.notifyRepo.DeleteAllNotifications(ctx)
	if err != nil {
		return err
	}

	// 2. Fetch all planner entries with meals and their ingredients
	entries, err := s.client.Planner.FindMany().With(
		db.Planner.Meal.Fetch().With(
			db.Meal.Ingredients.Fetch(),
		),
	).Exec(ctx)
	if err != nil {
		return err
	}

	// 3. For each planned meal, check ingredient availability
	for _, entry := range entries {
		var missing []string
		meal := entry.Meal()
		for _, ingredient := range meal.Ingredients() {
			if !ingredient.IsAvailable {
				missing = append(missing, ingredient.Name)
			}
		}

		// 4. If ingredients are missing, create a notification
		if len(missing) > 0 {
			missingStr := strings.Join(missing, ", ")
			_, err := s.notifyRepo.CreateNotification(ctx, entry.DayOfWeek, entry.MealType, missingStr)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *notificationService) GetNotifications(ctx context.Context) ([]db.NotificationModel, error) {
	return s.notifyRepo.GetAllNotifications(ctx)
}

func (s *notificationService) GetNotificationsByDay(ctx context.Context, dayOfWeek string) ([]db.NotificationModel, error) {
	return s.notifyRepo.GetNotificationsByDay(ctx, dayOfWeek)
}

func (s *notificationService) RemoveNotification(ctx context.Context, id string) (*db.NotificationModel, error) {
	return s.notifyRepo.DeleteNotification(ctx, id)
}
