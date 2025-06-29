# Versions

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
