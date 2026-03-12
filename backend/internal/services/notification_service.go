package services

import (
	"context"
	"fmt"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"strings"
	"time"
)

type NotificationService interface {
	GenerateNotifications(ctx context.Context) error
	GetNotifications(ctx context.Context) ([]db.NotificationModel, error)
	MarkAsRead(ctx context.Context, id string) (*db.NotificationModel, error)
	RemoveNotification(ctx context.Context, id string) (*db.NotificationModel, error)
}

type notificationService struct {
	notifyRepo   repository.NotificationRepository
	plannerRepo  repository.PlannerRepository
	shoppingRepo repository.ShoppingRepository
	client       *db.PrismaClient
}

func NewNotificationService(
	notifyRepo repository.NotificationRepository,
	plannerRepo repository.PlannerRepository,
	shoppingRepo repository.ShoppingRepository,
	client *db.PrismaClient,
) NotificationService {
	return &notificationService{
		notifyRepo:   notifyRepo,
		plannerRepo:  plannerRepo,
		shoppingRepo: shoppingRepo,
		client:       client,
	}
}

func (s *notificationService) GenerateNotifications(ctx context.Context) error {
	// 1. Clear old notifications
	_, err := s.notifyRepo.DeleteAllNotifications(ctx)
	if err != nil {
		return err
	}

	// 2. Check for missing ingredients in planned meals
	entries, err := s.client.Planner.FindMany().With(
		db.Planner.Meal.Fetch().With(
			db.Meal.Ingredients.Fetch(),
		),
	).Exec(ctx)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		var missing []string
		meal := entry.Meal()
		for _, ingredient := range meal.Ingredients() {
			if !ingredient.IsAvailable {
				missing = append(missing, ingredient.Name)
			}
		}

		if len(missing) > 0 {
			title := fmt.Sprintf("Missing ingredients for %s", entry.DayOfWeek)
			message := fmt.Sprintf("You are missing %s for your %s meal (%s).", 
				strings.Join(missing, ", "), entry.MealType, meal.Name)
			_, err := s.notifyRepo.CreateNotification(ctx, title, message, "missing_ingredient")
			if err != nil {
				return err
			}
		}
	}

	// 3. Check for pending shopping items
	shoppingItems, err := s.shoppingRepo.GetAllItems(ctx)
	if err != nil {
		return err
	}

	pendingCount := 0
	for _, item := range shoppingItems {
		if item.Status == "pending" {
			pendingCount++
		}
	}

	if pendingCount > 0 {
		title := "Pending shopping items"
		message := fmt.Sprintf("You have %d items in your shopping list that are still pending.", pendingCount)
		_, err := s.notifyRepo.CreateNotification(ctx, title, message, "shopping")
		if err != nil {
			return err
		}
	}

	// 4. Check for "forgotten" items (pending items older than 3 days)
	threeDaysAgo := time.Now().AddDate(0, 0, -3)
	forgottenCount := 0
	for _, item := range shoppingItems {
		if item.Status == "pending" && item.CreatedAt.Before(threeDaysAgo) {
			forgottenCount++
		}
	}

	if forgottenCount > 0 {
		title := "Forgotten shopping items"
		message := fmt.Sprintf("You have %d items in your shopping list for more than 3 days. Don't forget to buy them!", forgottenCount)
		_, err := s.notifyRepo.CreateNotification(ctx, title, message, "forgotten_item")
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *notificationService) GetNotifications(ctx context.Context) ([]db.NotificationModel, error) {
	return s.notifyRepo.GetAllNotifications(ctx)
}

func (s *notificationService) MarkAsRead(ctx context.Context, id string) (*db.NotificationModel, error) {
	return s.notifyRepo.MarkAsRead(ctx, id)
}

func (s *notificationService) RemoveNotification(ctx context.Context, id string) (*db.NotificationModel, error) {
	return s.notifyRepo.DeleteNotification(ctx, id)
}
