# justfile for kadykov.com

# Default target: list all available targets
default:
    just --list

# Run the development server
dev:
    npm run dev

# Build the website
build:
    npm run build

# Preview the built website
preview:
    npm run preview

# Build and then preview the built website (sequentially)
bp:
    just build && just preview

# Format code with Prettier
fmt:
    npx prettier --write .

# Lint code with ESLint
lint:
    npx eslint .
