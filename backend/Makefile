build:
	go mod tidy
	go run github.com/steebchen/prisma-client-go generate
	go build -o api ./cmd/api/main.go
