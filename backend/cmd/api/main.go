package main

import (
	"fmt"
	"log"
	"meal-planner-backend/internal/handlers"
	"meal-planner-backend/internal/middleware"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/internal/routes"
	"meal-planner-backend/internal/services"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	godotenv.Load()

	// 1. Setup repository (Prisma)
	prismaRepo, err := repository.NewPrismaRepository()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer prismaRepo.Close()

	// 2. Setup domain-specific repositories
	userRepo := repository.NewUserRepository(prismaRepo)
	mealRepo := repository.NewMealRepository(prismaRepo)
	ingredientRepo := repository.NewIngredientRepository(prismaRepo)
	plannerRepo := repository.NewPlannerRepository(prismaRepo)
	notifyRepo := repository.NewNotificationRepository(prismaRepo)
	shoppingRepo := repository.NewShoppingRepository(prismaRepo)

	// 3. Setup services
	authService := services.NewAuthService(userRepo)
	mealService := services.NewMealService(mealRepo)
	ingredientService := services.NewIngredientService(ingredientRepo)
	plannerService := services.NewPlannerService(plannerRepo)
	shoppingService := services.NewShoppingService(shoppingRepo)
	notifyService := services.NewNotificationService(notifyRepo, plannerRepo, shoppingRepo, prismaRepo.Client)

	// 4. Setup handlers
	authHandler := handlers.NewAuthHandler(authService)
	mealHandler := handlers.NewMealHandler(mealService)
	ingredientHandler := handlers.NewIngredientHandler(ingredientService)
	plannerHandler := handlers.NewPlannerHandler(plannerService)
	notificationHandler := handlers.NewNotificationHandler(notifyService)
	shoppingHandler := handlers.NewShoppingHandler(shoppingService)

	// 5. Setup router
	mux := http.NewServeMux()
	authMiddleware := middleware.AuthMiddleware(authService)
	routes.SetupRoutes(
		mux,
		authHandler,
		mealHandler,
		ingredientHandler,
		plannerHandler,
		notificationHandler,
		shoppingHandler,
		authMiddleware,
	)

	// Add CORS middleware
	corsMux := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		mux.ServeHTTP(w, r)
	})

	// 6. Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server running on port %s 🚀\n", port)
	if err := http.ListenAndServe(":"+port, corsMux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
