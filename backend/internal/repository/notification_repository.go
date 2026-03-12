package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type NotificationRepository interface {
	GetAllNotifications(ctx context.Context) ([]db.NotificationModel, error)
	CreateNotification(ctx context.Context, title string, message string, notifyType string) (*db.NotificationModel, error)
	MarkAsRead(ctx context.Context, id string) (*db.NotificationModel, error)
	DeleteNotification(ctx context.Context, id string) (*db.NotificationModel, error)
	DeleteAllNotifications(ctx context.Context) (int, error)
}

type notificationRepo struct {
	repo *PrismaRepository
}

func NewNotificationRepository(repo *PrismaRepository) NotificationRepository {
	return &notificationRepo{repo: repo}
}

func (n *notificationRepo) GetAllNotifications(ctx context.Context) ([]db.NotificationModel, error) {
	return n.repo.Client.Notification.FindMany().OrderBy(
		db.Notification.CreatedAt.Order(db.SortOrderDesc),
	).Exec(ctx)
}

func (n *notificationRepo) CreateNotification(ctx context.Context, title string, message string, notifyType string) (*db.NotificationModel, error) {
	return n.repo.Client.Notification.CreateOne(
		db.Notification.Title.Set(title),
		db.Notification.Message.Set(message),
		db.Notification.Type.Set(notifyType),
	).Exec(ctx)
}

func (n *notificationRepo) MarkAsRead(ctx context.Context, id string) (*db.NotificationModel, error) {
	return n.repo.Client.Notification.FindUnique(
		db.Notification.ID.Equals(id),
	).Update(
		db.Notification.IsRead.Set(true),
	).Exec(ctx)
}

func (n *notificationRepo) DeleteNotification(ctx context.Context, id string) (*db.NotificationModel, error) {
	return n.repo.Client.Notification.FindUnique(
		db.Notification.ID.Equals(id),
	).Delete().Exec(ctx)
}

func (n *notificationRepo) DeleteAllNotifications(ctx context.Context) (int, error) {
	res, err := n.repo.Client.Notification.FindMany().Delete().Exec(ctx)
	return res.Count, err
}
