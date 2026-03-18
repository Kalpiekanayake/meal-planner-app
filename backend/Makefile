build:
	go mod tidy
	# PRISMA_CLIENT_GO_BINARIES_ALL=true ensures the Linux engine is downloaded and 
	# accessible during the build process on Choreo.
	PRISMA_CLIENT_GO_BINARIES_ALL=true go run github.com/steebchen/prisma-client-go generate
	go build -v -o api ./cmd/api/main.go
