FROM golang:1.24.4-bookworm AS builder

WORKDIR /app

# Retrieve application dependencies.
# This allows the container build to reuse cached dependencies.
# Expecting to copy go.mod and if present go.sum.
COPY go.* ./
RUN go mod download

# Copy local code to the container image.
# COPY . ./

# install air to have the hot reload
RUN go install github.com/air-verse/air@latest

# Run the web service on container startup.
CMD ["air"]
# CMD ["go", "run", "."]