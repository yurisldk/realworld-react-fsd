# 🙌 RealWorld example app 🍰 Feature-Sliced Design

This codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API. Powered by [FSD (Feature-Sliced Design)](https://feature-sliced.design) architectural methodology.

![Realworld example app](./logo.gif)

---

[![TypeScript][shields-typescript-domain]](https://www.typescriptlang.org/)
[![Webpack][shields-webpack-domain]](https://webpack.js.org/)
[![Jest][shields-jest-domain]](https://jestjs.io/)
[![React][shields-react-domain]](https://react.dev/)
[![React Router][shields-react-router-domain]](https://reactrouter.com/)
[![React Query][shields-react-query-domain]](https://tanstack.com/query/v4/)
[![Redux][shields-redux-domain]](https://redux.js.org/)
[![Zod][shields-zod-domain]](https://zod.dev/)
[![Feature-Sliced Design][shields-fsd-domain]](https://feature-sliced.design/)

## Backend Solution for RealWorld API Challenges

As part of the solution to the issues caused by recent changes to the [RealWorld API specifications](https://github.com/gothinkster/realworld/issues/1611), I’ve forked an backend and created a fully compatible alternative with **[RealWorld Express + Prisma](https://github.com/yurisldk/node-express-realworld-example-app)**.

This fork addresses the challenges caused by the deletion of the official API server and demo deployment, and it implements the updated API specifications to keep the project running smoothly.

To get the backend up and running, you can find instructions on how to install and set it up in the [RealWorld Express + Prisma repository](https://github.com/yurisldk/node-express-realworld-example-app).

Feel free to contribute or reach out if you have any questions or suggestions!

## Features

![Preview][preview-domain]

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication.

### Advanced Features

- **Lazy Loading for React Components and React Router** – Components and routes are dynamically loaded only when needed, improving initial load times and optimizing performance.
- **React Suspense** – Used for handling asynchronous component loading, providing a smooth user experience while waiting for data to load.
- **Error Boundaries** – Ensures the application remains stable by catching JavaScript errors in component trees and displaying fallback UIs instead of crashing the app.
- **Optimistic Updates with React Query** – Provides an enhanced user experience by updating the UI immediately before waiting for the server response, making interactions feel faster.
- **Lazy Loading for Redux Slices** – Dynamically loads Redux slices when required, reducing the initial bundle size and improving app efficiency.
- **Zod Validation for Backend Responses** – Ensures API responses adhere to expected structures using Zod contracts, improving reliability and preventing unexpected runtime errors.

### Dependency Graph

![Dependency Graph][dependency-graph-domain]

### Bundle Analyze

![Bundle Analyze][bundle-analyze-domain]

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout button on settings page)
- CRU- users (sign up & settings page - no deleting required)
- CRUD Articles
- CR-D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

## Getting started

To get the frontend running locally:

1. Clone this repo
2. `yarn install` to install all the dependencies defined in a `package.json` file.
3. `yarn start` to start webpack dev server.

## Backend Setup

This project is fully compatible with my **[RealWorld Express + Prisma](https://github.com/yurisldk/node-express-realworld-example-app)** backend implementation.

To set up the backend:

1. Follow the installation instructions in the [RealWorld Express + Prisma repository](https://github.com/yurisldk/node-express-realworld-example-app).
2. Ensure the backend is running locally or deployed.

## Scripts

- **`yarn start`** - Runs the Webpack development server with `webpack serve`, using development mode.
- **`yarn build:dev`** - Compiles the project in development mode using Webpack.
- **`yarn build:prod`** - Compiles the project in production mode using Webpack for optimized output.
- **`yarn analyze`** - Builds the project in development mode and enables Webpack Bundle Analyzer for visualizing bundle contents.
- **`yarn test`** - Runs Jest to execute unit tests.
- **`yarn eslint`** - Runs ESLint to lint the `src` directory, automatically fixing issues and ensuring no unused disable directives remain.
- **`yarn prettier`** - Formats the entire project using Prettier, respecting `.gitignore` rules.
- **`yarn graph`** - Generates a dependency graph of the `src` directory using `dependency-cruiser`.[^1]

[^1]:
    This assumes the GraphViz `dot` command is available - on most linux and
    comparable systems this will be. In case it's not, see
    [GraphViz' download page](https://www.graphviz.org/download/) for instructions
    on how to get it on your machine.

[shields-react-router-domain]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[shields-react-query-domain]: https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white
[shields-typescript-domain]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[shields-fsd-domain]: https://img.shields.io/badge/Feature--Sliced-Design?style=for-the-badge&color=F2F2F2&labelColor=262224&logoWidth=10&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAaCAYAAAC3g3x9AAAACXBIWXMAAALFAAACxQGJ1n/vAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABISURBVHgB7dKxCQAgDETR0w2cws0cys2cwhEUBbsggikCuVekDHwSQFlYo7Q+8KnmtHdFWMdk2cl5wSsbxGSZw8dm8pX9ZHUTMBUgGU2F718AAAAASUVORK5CYII=
[shields-react-domain]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[dependency-graph-domain]: ./dependency-graph-preview.svg
[preview-domain]: ./preview.gif
[bundle-analyze-domain]: ./bundle-analyze.png
[shields-webpack-domain]: https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white
[shields-jest-domain]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[shields-redux-domain]: https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white
[shields-zod-domain]: https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7
