# 🙌 RealWorld example app 🍰 Feature-Sliced Design

This codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API. Powered by [FSD (Feature-Sliced Design)](https://feature-sliced.design) architectural methodology.

![Realworld example app](./logo.gif)

---

[![Feature-Sliced Design][shields-fsd-domain]](https://feature-sliced.design/)
[![Vite][shields-vite-domain]](https://vitejs.dev/)
[![React][shields-react-domain]](https://react.dev/)
[![React Router][shields-react-router-domain]](https://reactrouter.com/)
[![React Query][shields-react-query-domain]](https://tanstack.com/query/v4/)
[![Zustand][shields-zustand-domain]](https://zustand-demo.pmnd.rs/)
[![TypeScript][shields-typescript-domain]](https://www.typescriptlang.org/)

## Backend Assistance Request

Hello everyone,

I’m currently working on the backend for the RealWorld application, built using React. However, I’ve encountered some challenges due to recent updates to the API specifications. As mentioned in this [GitHub discussion](https://github.com/gothinkster/realworld/issues/1611), the project will no longer be maintained. The API server has been deleted, and the demo deployment is no longer available, which has introduced some issues for developers relying on it.

If anyone has experience with these changes or expertise in implementing the backend, I’d greatly appreciate your assistance in adapting my backend to align with the updated specifications. Your support will be essential in ensuring compatibility and smooth operation for the app.

As a temporary solution, we can use the official backend implementation from [this GitHub repository](https://github.com/gothinkster/node-express-realworld-example-app) or explore other community-backed implementations available through [Codebase Show](https://codebase.show/projects/realworld?category=backend). These resources should help keep the project running while I work on resolving the backend issues.

For further details and feedback, please refer to the [Backend Assistance Request Issue](https://github.com/yurisldk/realworld-react-fsd/issues/19) for more context and ongoing updates.

Feel free to reach out or contribute to the repository if you can provide help!

## Features

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication.

![Dependency Graph][dependency-graph-domain]

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout button on settings page)
- CRU- users (sign up & settings page - no deleting required)
- CRUD Articles
- CR-D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

**The general page breakdown:**

- Home page (URL: / )
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
  - Pagination for list of articles
- Sign in/Sign up pages (URL: /login, /register )
  - Uses JWT (store the token in localStorage)
  - Authentication can be easily switched to session/cookie based
- Settings page (URL: /settings )
- Editor page to create/edit articles (URL: /editor, /editor/article-slug-here )
- Article page (URL: /article/article-slug-here )
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
- Profile page (URL: /profile/:username, /profile/:username/favorites)
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles

## Getting started

This project was bootstrapped with [Create Vite](https://vitejs.dev/guide/#getting-started)

To get the frontend running locally:

1. Clone this repo
2. `yarn install` to install all the dependencies defined in a `package.json` file.
3. `yarn dev` to start Vite dev server.

## Scripts

- `yarn dev` - start a development server with hot reload.
- `yarn build` - build for production. The generated files will be on the dist folder.
- `yarn preview` - locally preview the production build.
- `yarn lint` - run ESLint.
- `yarn lint:perf` - run ESLint and track the performance of individual rules.
- `yarn prettier` - run Prettier on changed files.
- `yarn prettier:all` - run Prettier on all files.
- `yarn test:run` - run all test suites.
- `yarn test:watch` - run all test suites but watch for changes and rerun tests when they change.
- `yarn test:coverage` - run all test suites and enable coverage report.
- `yarn test:coverage:open` - run all test suites and enable coverage report then open coverage report in browser.
- `yarn dep-cruiser:preview` - create a graph of the dependencies[^1]

[^1]:
    This assumes the GraphViz `dot` command is available - on most linux and
    comparable systems this will be. In case it's not, see
    [GraphViz' download page](https://www.graphviz.org/download/) for instructions
    on how to get it on your machine.

[shields-react-router-domain]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[shields-react-query-domain]: https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white
[shields-zustand-domain]: https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[shields-typescript-domain]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[shields-fsd-domain]: https://img.shields.io/badge/Feature--Sliced-Design?style=for-the-badge&color=F2F2F2&labelColor=262224&logoWidth=10&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAaCAYAAAC3g3x9AAAACXBIWXMAAALFAAACxQGJ1n/vAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABISURBVHgB7dKxCQAgDETR0w2cws0cys2cwhEUBbsggikCuVekDHwSQFlYo7Q+8KnmtHdFWMdk2cl5wSsbxGSZw8dm8pX9ZHUTMBUgGU2F718AAAAASUVORK5CYII=
[shields-vite-domain]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[shields-react-domain]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[netlify-domain]: https://api.netlify.com/api/v1/badges/5d5013c3-ec61-4496-8f48-caa7145fb166/deploy-status
[dependency-graph-domain]: ./dependency-graph-preview.svg
[build-domain]: https://github.com/sldk-yuri/realworld-react-fsd/actions/workflows/build.yml/badge.svg
[codecov-domain]: https://codecov.io/gh/sldk-yuri/realworld-react-fsd/branch/master/graph/badge.svg?token=IXE2YRPYK5
[prettier-domain]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[license-domain]: https://img.shields.io/badge/license-MIT-green.svg
