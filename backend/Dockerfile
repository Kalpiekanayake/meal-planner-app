# Build stage
FROM golang:1.25-bookworm AS builder

RUN apt-get update && apt-get install -y --no-install-recommends gcc libc6-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source (including prisma schema)
COPY . .

# Generate Prisma client and build (native engine matches the Debian runtime stage)
RUN go run github.com/steebchen/prisma-client-go generate
RUN go build -v -o api ./cmd/api/main.go

# Runtime stage — use Debian to match generated Prisma engine binaries.
# For production (x86_64 Choreo/K8s): docker build --platform linux/amd64 .
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl nodejs npm && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/api .
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Install Prisma CLI for running migrations (ignore postinstall to skip Go codegen,
# then explicitly fetch Prisma engine binaries needed for migrations)
RUN npm install --omit=dev --ignore-scripts && npx prisma version

# Set ownership for non-root user
RUN chown -R 10014:10014 /app

EXPOSE 8080

USER 10014

# Run migrations then start the server
CMD ./api
