# 🙌 RealWorld example app 🍰 Feature-Sliced Design

A modern implementation of the [RealWorld](https://github.com/gothinkster/realworld) app using [FSD (Feature-Sliced Design)](https://feature-sliced.github.io/documentation), React, TypeScript, and a contemporary frontend stack.

![Realworld example app](./logo.gif)

## About the Project

This project is an educational and demonstration Medium-clone built with the Feature-Sliced Design (FSD) architectural approach and modern frontend tools. It is suitable for learning, experimentation, and as a template for large-scale applications.

![Preview][preview-domain]

## Tech Stack

- **React** 18+
- **TypeScript**
- **Feature-Sliced Design (FSD)**
- **React Router**
- **React Query**
- **Redux Toolkit**
- **React Hook Form**
- **Webpack**
- **Jest** (unit tests)
- **Cypress** (e2e tests)
- **Zod** (schema validation)
- **CSS Modules**

## Project Structure

- `src/` — application source code
  - `app/` — app initialization, routing, providers
  - `pages/` — application pages (home, article, login, register, settings, 404, etc.)
  - `widgets/` — large widgets (article feed, comments, etc.)
  - `features/` — business features (authentication, articles, comments, etc.)
  - `entities/` — business entities (article, comment, profile, etc.)
  - `shared/` — reusable modules, utilities, UI components, API
- `public/` — static files
- `build/` — production build output
- `coverage/` — test coverage reports
- `cypress/` — e2e tests

## Advanced Features

- **Code Splitting & Lazy Loading** - React components and routes are loaded on demand, reducing initial bundle size and improving performance.
- **React Suspense & Concurrent Features** - Handles asynchronous loading and leverages modern React features for a smoother user experience.
- **Error Boundaries & Centralized Error Logging** - Prevents app crashes by catching JavaScript errors in component trees and displaying fallback UIs, with centralized error reporting.
- **Optimistic UI Updates & Data Prefetching (React Query)** - Instantly updates the UI before server confirmation, prefetches and caches data for fast, responsive interactions.
- **Dynamic Redux Slices** - Loads Redux slices only when needed, optimizing bundle size and state management.
- **Type-Safe API Layer with Axios** - Centralized, strongly-typed API requests and error handling.
- **Zod-based API Validation** - Validates backend responses with Zod schemas, ensuring data consistency and type safety.
- **React Hook Form Integration** - Efficient, scalable form state management with validation and error display.
- **Role-based Access & Permissions** - Permission checks for UI and API actions.
- **Comprehensive Testing** - Includes unit (Jest) and e2e (Cypress) tests, with tag-based selection, custom commands, and coverage reports.
- **CI/CD Integration** - Automated testing, linting, and formatting in the pipeline for reliable delivery.
- **Environment-based Configuration** - Supports multiple environments via `.env` files and runtime variables.
- **Feature-Sliced Design Architecture** - Strict adherence to FSD for scalable, maintainable code.
- **Custom ESLint & Prettier Rules** - Enforced code style, import order, and formatting for consistency.
- **Bundle Analysis & Dependency Graphs** - Visual tools for analyzing bundle size and module dependencies.
- **Hot Module Replacement & Fast Refresh** - Instant feedback during development for a seamless DX.

### Dependency Graph

![Dependency Graph][dependency-graph-domain]

### Bundle Analyze

![Bundle Analyze][bundle-analyze-domain]

## Scripts

- **`yarn start`** - Launches the Webpack development server with hot module replacement.
- **`yarn build:dev`** - Builds the project in development mode.
- **`yarn build:prod`** - Builds the project in production mode with optimizations.
- **`yarn analyze`** - Builds and opens the Webpack Bundle Analyzer for bundle inspection.
- **`yarn test`** - Runs all unit tests with Jest.
- **`yarn eslint`** - Lints and auto-fixes code in the `src` directory.
- **`yarn prettier`** - Formats the codebase using Prettier.
- **`yarn graph`** - Generates a dependency graph of the `src` directory using `dependency-cruiser`.[^1]
- **`yarn cy:open`** - Opens the Cypress UI for interactive e2e testing.
- **`yarn cy:run`** - Runs all Cypress e2e tests in headless mode.
- **`yarn prepare`** - Sets up Husky git hooks for pre-commit and pre-push.
- **`yarn db:seed:dev`** - Seeds the development database via backend API.
- **`yarn db:seed:prod`** - Seeds the production database via backend API.

[^1]:
    This assumes the GraphViz `dot` command is available - on most linux and
    comparable systems this will be. In case it's not, see
    [GraphViz' download page](https://www.graphviz.org/download/) for instructions
    on how to get it on your machine.

## Demo Environment

A ready-to-use demo environment is provided for running both the frontend (this repo) and the backend ([node-express-realworld-example-app](https://github.com/yurisldk/node-express-realworld-example-app)) together using Docker Compose.

The setup in [`ops/deploy/demo`](./ops/deploy/demo) includes preconfigured services:

- **frontend** — React-based frontend client
- **api** — Node.js/Express backend API with Prisma and PostgreSQL
- **db** — PostgreSQL database for persistent storage
- **pgadmin** — Admin UI for managing PostgreSQL

### Usage

1. A `.env` file is already provided in the demo directory. No extra setup is needed.
2. Start the environment:
   ```bash
   docker-compose -f ops/deploy/demo/docker-compose.yml --env-file ops/deploy/demo/.env up --build -d
   ```
3. Access the services:
   - Frontend: <http://localhost:30401>
   - API: <http://localhost:30400>
   - PgAdmin: <http://localhost:30433>

**Notes:**

- PostgreSQL data is persisted via named volumes.
- Images are pulled from GitHub Container Registry (GHCR).
- On ARM-based systems (e.g., Apple Silicon), ensure Docker supports `linux/amd64` platform.

[dependency-graph-domain]: ./dependency-graph-preview.svg
[preview-domain]: ./preview.gif
[bundle-analyze-domain]: ./bundle-analyze.png
