package middleware

import (
	"context"
	"meal-planner-backend/internal/services"
	"net/http"
	"strings"
)

func AuthMiddleware(authService services.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				// No token, but we allow the request to proceed
				// Handlers must check if "user_id" is present for protected actions
				next.ServeHTTP(w, r)
				return
			}

			tokenParts := strings.Split(authHeader, " ")
			if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
				// Invalid format, but we allow it to proceed as guest
				next.ServeHTTP(w, r)
				return
			}

			tokenString := tokenParts[1]
			userID, err := authService.ValidateToken(tokenString)
			if err != nil {
				// Invalid token, proceed as guest
				next.ServeHTTP(w, r)
				return
			}

			ctx := context.WithValue(r.Context(), "user_id", userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
