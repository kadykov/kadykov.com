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

# Validate HTML files in dist folder
validate:
    npm run validate:html

# Build and validate HTML
build-validate:
    just build && just validate

# Format code with Prettier
fmt:
    npm run format

# Lint CSS with Stylelint
lint-css:
    npm run lint:css

# Fix CSS linting issues automatically
lint-css-fix:
    npm run lint:css:fix

# Lint code with ESLint
lint:
    npm run lint

# Run all linting (ESLint + Stylelint)
lint-all:
    npm run lint:all
