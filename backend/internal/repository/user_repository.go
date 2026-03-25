package repository

import (
	"context"
	"errors"
	"meal-planner-backend/prisma/db"
	"time"
)

type UserRepository interface {
	CreateUser(ctx context.Context, name, email, password string) (*db.UserModel, error)
	GetUserByEmail(ctx context.Context, email string) (*db.UserModel, error)
	GetUserByID(ctx context.Context, id string) (*db.UserModel, error)
	UpdateUserPassword(ctx context.Context, id, hashedPassword string) (*db.UserModel, error)
}

type userRepo struct {
	repo *PrismaRepository
}

func NewUserRepository(repo *PrismaRepository) UserRepository {
	return &userRepo{repo: repo}
}

func (r *userRepo) CreateUser(ctx context.Context, name, email, password string) (*db.UserModel, error) {
	// Let the database handle the ID (cuid) if possible, but ensure everything else is explicit.
	return r.repo.Client.User.CreateOne(
		db.User.Name.Set(name),
		db.User.Email.Set(email),
		db.User.Password.Set(password),
		db.User.UpdatedAt.Set(time.Now()),
	).Exec(ctx)
}

func (r *userRepo) GetUserByEmail(ctx context.Context, email string) (*db.UserModel, error) {
	user, err := r.repo.Client.User.FindUnique(
		db.User.Email.Equals(email),
	).Exec(ctx)
	
	if errors.Is(err, db.ErrNotFound) {
		return nil, nil
	}
	
	return user, err
}

func (r *userRepo) GetUserByID(ctx context.Context, id string) (*db.UserModel, error) {
	user, err := r.repo.Client.User.FindUnique(
		db.User.ID.Equals(id),
	).Exec(ctx)
	
	if errors.Is(err, db.ErrNotFound) {
		return nil, nil
	}
	
	return user, err
}

func (r *userRepo) UpdateUserPassword(ctx context.Context, id, hashedPassword string) (*db.UserModel, error) {
	user, err := r.repo.Client.User.FindUnique(
		db.User.ID.Equals(id),
	).Update(
		db.User.Password.Set(hashedPassword),
	).Exec(ctx)
	
	if errors.Is(err, db.ErrNotFound) {
		return nil, nil
	}
	
	return user, err
}
