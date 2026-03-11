package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type NotificationRepository interface {
	CreateNotification(ctx context.Context, dayOfWeek, mealType, missingIngredients string) (*db.NotificationModel, error)
	GetAllNotifications(ctx context.Context) ([]db.NotificationModel, error)
	GetNotificationsByDay(ctx context.Context, dayOfWeek string) ([]db.NotificationModel, error)
	DeleteNotification(ctx context.Context, id string) (*db.NotificationModel, error)
	DeleteAllNotifications(ctx context.Context) (int, error)
}

type notificationRepo struct {
	repo *PrismaRepository
}

func NewNotificationRepository(repo *PrismaRepository) NotificationRepository {
	return &notificationRepo{repo: repo}
}

func (r *notificationRepo) CreateNotification(ctx context.Context, dayOfWeek, mealType, missingIngredients string) (*db.NotificationModel, error) {
	return r.repo.Client.Notification.CreateOne(
		db.Notification.DayOfWeek.Set(dayOfWeek),
		db.Notification.MealType.Set(mealType),
		db.Notification.MissingIngredients.Set(missingIngredients),
	).Exec(ctx)
}

func (r *notificationRepo) GetAllNotifications(ctx context.Context) ([]db.NotificationModel, error) {
	return r.repo.Client.Notification.FindMany().OrderBy(
		db.Notification.CreatedAt.Order(db.SortOrderDesc),
	).Exec(ctx)
}

func (r *notificationRepo) GetNotificationsByDay(ctx context.Context, dayOfWeek string) ([]db.NotificationModel, error) {
	return r.repo.Client.Notification.FindMany(
		db.Notification.DayOfWeek.Equals(dayOfWeek),
	).Exec(ctx)
}

func (r *notificationRepo) DeleteNotification(ctx context.Context, id string) (*db.NotificationModel, error) {
	return r.repo.Client.Notification.FindUnique(
		db.Notification.ID.Equals(id),
	).Delete().Exec(ctx)
}

func (r *notificationRepo) DeleteAllNotifications(ctx context.Context) (int, error) {
	batch, err := r.repo.Client.Notification.FindMany().Delete().Exec(ctx)
	return batch.Count, err
}
