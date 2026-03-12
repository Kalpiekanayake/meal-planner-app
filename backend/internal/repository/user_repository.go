package repository

import (
	"context"
	"meal-planner-backend/prisma/db"
)

type UserRepository interface {
	CreateUser(ctx context.Context, name, email, password string) (*db.UserModel, error)
	GetUserByEmail(ctx context.Context, email string) (*db.UserModel, error)
	GetUserByID(ctx context.Context, id string) (*db.UserModel, error)
}

type userRepo struct {
	repo *PrismaRepository
}

func NewUserRepository(repo *PrismaRepository) UserRepository {
	return &userRepo{repo: repo}
}

func (r *userRepo) CreateUser(ctx context.Context, name, email, password string) (*db.UserModel, error) {
	return r.repo.Client.User.CreateOne(
		db.User.Name.Set(name),
		db.User.Email.Set(email),
		db.User.Password.Set(password),
	).Exec(ctx)
}

func (r *userRepo) GetUserByEmail(ctx context.Context, email string) (*db.UserModel, error) {
	return r.repo.Client.User.FindUnique(
		db.User.Email.Equals(email),
	).Exec(ctx)
}

func (r *userRepo) GetUserByID(ctx context.Context, id string) (*db.UserModel, error) {
	return r.repo.Client.User.FindUnique(
		db.User.ID.Equals(id),
	).Exec(ctx)
}
