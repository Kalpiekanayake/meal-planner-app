package main

import (
	"fmt"
	"log"
	"meal-planner-backend/internal/handlers"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/internal/routes"
	"meal-planner-backend/internal/services"
	"net/http"
	"os"
)

func main() {
	// 1. Setup repository (Prisma)
	prismaRepo, err := repository.NewPrismaRepository()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer prismaRepo.Close()

	// 2. Setup domain-specific repositories
	mealRepo := repository.NewMealRepository(prismaRepo)

	// 3. Setup services
	mealService := services.NewMealService(mealRepo)

	// 4. Setup handlers
	mealHandler := handlers.NewMealHandler(mealService)

	// 5. Setup router
	mux := http.NewServeMux()
	routes.SetupRoutes(mux, mealHandler)

	// 6. Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server running on port %s 🚀\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
