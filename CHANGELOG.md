# Versions

## 2.1.0 (2026-05-25)

### 🚀 Features

- Adopted the current official RealWorld Conduit theme stylesheet
- Updated typography integration for the new `Lora` and `Source Sans Pro` font contract
- Added React root layout adaptation for correct sticky footer behavior

### ⚡ Performance

- Reduced global stylesheet size by replacing the bundled Bootstrap-based stylesheet
- Added production CSS minification
- Configured browser targets and updated Browserslist data
- Added a webpack performance budget aligned with the current initial bundle

## 2.0.0 (2026-04-25)

### 🚀 Features

- Upgraded the application stack to React 19, React Router 7, TanStack Query 5, and Zod 4
- Moved the active application structure to page-scoped route modules from the previous multi-layer FSD tree
- Adopted React Router loaders and actions for page data loading and mutations
- Added an OpenAPI, Orval, and Zod-based generated API workflow
- Moved Docker and nginx deployment files to the project root

### ⚠️ Breaking Changes

- Removed the previous Cypress setup from the active project structure
- Removed the previous `ops/deploy/demo` setup from the active project structure

## 1.2.1 (2025-06-29)

### 🐛 Bug Fixes

- Improved error handling in `BubbleError` function

## 1.2.0 (2025-06-29)

### 🚀 Features

- Added Cypress end-to-end testing framework with comprehensive user flow tests
- Introduced data-test attributes for improved testability
- Enabled strict null checks in TypeScript configuration for better type safety
- Refactored environment variable management for clarity and multi-env support
- Enhanced test support and coverage across UI components

### 🐛 Bug Fixes

- Fixed Docker login action to use GHCR_PAT instead of GITHUB_TOKEN
- Minor CI/CD and workflow improvements

## 1.1.1 (2025-06-15)

### 🐛 Bug Fixes

- Fixed missing GHCR authentication in release pipeline

## 1.1.0 (2025-06-15)

### 🚀 Features

- Integrated initial demo environment configuration
- Enhanced CI/CD workflows and GitHub Actions
- Optimized Husky pre-push hook performance
- Added environment variable support across application layers
- Fixed JSX runtime default import issue

## 1.0.0 (2025-06-08)

### 🚀 Features

- Complete CI/CD pipeline setup for automated builds and deployments
- Integrated Git hooks and automatic code formatting workflows
- Implemented lazy loading for pages and components
- Added ErrorBoundary and UI components for error handling and display
- Developed core UI components including buttons, spinners, and error pages
- Backend integration with API support for authentication and user profiles
- Incorporated React Query, Redux, React Hook Form, and Zod for state management and validation
- Full article management: creation, deletion, updating, favorites, and pagination
- Added unit and integration tests for critical components and APIs
- Integrated React Router for application navigation
- Utilized modern tech stack: React 18, TypeScript, Webpack, Jest, ESLint, and Prettier
