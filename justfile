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

# Build the search index (run after build)
index:
    npx pagefind --site dist

# Build the website and create search index
build-index:
    just build && just index

# Preview the built website
preview:
    npm run preview

# Build, index, and then preview the website
bp:
    just build-index && just preview

# Validate HTML files in dist folder
validate:
    npm run validate:html

# Build, index, and validate HTML
build-validate:
    just build-index && just validate

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
