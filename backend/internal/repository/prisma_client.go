package repository

import (
	"context"
	"fmt"
	"meal-planner-backend/prisma/db"
	"time"
)

type PrismaRepository struct {
	Client *db.PrismaClient
}

func NewPrismaRepository() (*PrismaRepository, error) {
	client := db.NewClient()
	fmt.Println("Connecting to database...")
	
	// Set a manual timeout for the connection to avoid hanging indefinitely
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := client.Connect(); err != nil {
		fmt.Printf("DATABASE CONNECTION ERROR: %v\n", err)
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	
	fmt.Println("Successfully connected to database! 🚀")
	return &PrismaRepository{Client: client}, nil
}

func (r *PrismaRepository) Close() error {
	return r.Client.Disconnect()
}
