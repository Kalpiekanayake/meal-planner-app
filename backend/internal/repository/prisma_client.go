package repository

import (
	"fmt"
	"meal-planner-backend/prisma/db"
	"os"
)

type PrismaRepository struct {
	Client *db.PrismaClient
}

func NewPrismaRepository() (*PrismaRepository, error) {
	// Check if DATABASE_URL is set
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		fmt.Println("[WARNING] DATABASE_URL environment variable is not set!")
	} else {
		// Log a masked version for safety
		fmt.Printf("[INFO] Connecting to database with URL starting with: %s...\n", dbURL[:10])
	}

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
