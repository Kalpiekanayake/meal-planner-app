package repository

import (
	"fmt"
	"meal-planner-backend/prisma/db"
)

type PrismaRepository struct {
	Client *db.PrismaClient
}

func NewPrismaRepository() (*PrismaRepository, error) {
	client := db.NewClient()
	fmt.Println("Connecting to database...")
	if err := client.Connect(); err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	fmt.Println("Successfully connected to database!")
	return &PrismaRepository{Client: client}, nil
}

func (r *PrismaRepository) Close() error {
	return r.Client.Disconnect()
}
