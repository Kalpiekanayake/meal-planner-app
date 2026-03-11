package repository

import (
	"meal-planner-backend/prisma/db"
)

type PrismaRepository struct {
	Client *db.PrismaClient
}

func NewPrismaRepository() (*PrismaRepository, error) {
	client := db.NewClient()
	if err := client.Connect(); err != nil {
		return nil, err
	}
	return &PrismaRepository{Client: client}, nil
}

func (r *PrismaRepository) Close() error {
	return r.Client.Disconnect()
}
