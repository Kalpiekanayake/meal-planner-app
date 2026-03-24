package services

import (
	"context"
	"errors"
	"fmt"
	"meal-planner-backend/internal/repository"
	"meal-planner-backend/prisma/db"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(ctx context.Context, name, email, password string) (*db.UserModel, error)
	Login(ctx context.Context, email, password string) (string, *db.UserModel, error)
	ValidateToken(tokenString string) (string, error)
	GetUserByID(ctx context.Context, id string) (*db.UserModel, error)
}

type authService struct {
	repo   repository.UserRepository
	jwtKey []byte
}

func NewAuthService(repo repository.UserRepository) AuthService {
	key := []byte(os.Getenv("JWT_SECRET"))
	if len(key) == 0 {
		key = []byte("my-super-secret-key-change-it")
	}
	return &authService{
		repo:   repo,
		jwtKey: key,
	}
}

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

func (s *authService) Register(ctx context.Context, name, email, password string) (*db.UserModel, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	
	// Check for existing user
	existing, err := s.repo.GetUserByEmail(ctx, email)
	if err != nil {
		fmt.Printf("[AUTH Error] Database error checking user %s: %v\n", email, err)
		return nil, fmt.Errorf("database error: %v", err)
	}
	if existing != nil {
		fmt.Printf("[AUTH] Signup attempt for already existing email: %s\n", email)
		return nil, errors.New("email already in use")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return s.repo.CreateUser(ctx, name, email, string(hashedPassword))
}

func (s *authService) Login(ctx context.Context, email, password string) (string, *db.UserModel, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	
	fmt.Printf("[AUTH] Login attempt for: %s\n", email)

	user, err := s.repo.GetUserByEmail(ctx, email)
	if err != nil || user == nil {
		fmt.Printf("[AUTH] User not found or DB error for %s: %v\n", email, err)
		return "", nil, errors.New("invalid credentials")
	}

	// Try standard bcrypt comparison
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		fmt.Printf("[AUTH] Password mismatch for %s\n", email)
		return "", nil, errors.New("invalid credentials")
	}

	fmt.Printf("[AUTH] Login successful for: %s\n", email)

	expirationTime := time.Now().Add(72 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(s.jwtKey)
	if err != nil {
		return "", nil, err
	}

	return tokenString, user, nil
}

func (s *authService) ValidateToken(tokenString string) (string, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return s.jwtKey, nil
	})

	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", errors.New("invalid token")
	}

	return claims.UserID, nil
}

func (s *authService) GetUserByID(ctx context.Context, id string) (*db.UserModel, error) {
	return s.repo.GetUserByID(ctx, id)
}
