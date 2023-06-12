<!-- # ![RealWorld Example App](logo.png) -->

[![Netlify Status][netlify-domain]](https://realworld-fsd.netlify.app/)

[![Feature-Sliced Design][shields-fsd-domain]](https://feature-sliced.design/)
[![Vite][shields-vite-domain]](https://vitejs.dev/)
[![React][shields-react-domain]](https://react.dev/)
[![React Router][shields-react-router-domain]](https://reactrouter.com/)
[![React Query][shields-react-query-domain]](https://tanstack.com/query/v4/)
[![Zustand][shields-zustand-domain]](https://zustand-demo.pmnd.rs/)
[![TypeScript][shields-typescript-domain]](https://www.typescriptlang.org/)

> ### React + Zustand + React-Query codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://realworld-fsd.netlify.app/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **React + Zustand + React-Query** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **React + Zustand + React-Query** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# Features

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication.

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

# Getting started

This project was bootstrapped with [Create Vite](https://vitejs.dev/guide/#getting-started)

To get the frontend running locally:

1. Clone this repo
2. `yarn install` to install all the dependencies defined in a `package.json` file.
3. `yarn dev` to start Vite dev server.

# Scripts

- `yarn run dev` - start a development server with hot reload.
- `yarn run build` - build for production. The generated files will be on the dist folder.
- `yarn run preview` - locally preview the production build.
- `yarn run generate:api` - generate api via swagger scheme
- `yarn run lint` - run ESLint.
- `yarn run lint:perf` - run ESLint and track the performance of individual rules.
- `yarn run prettier` - run Prettier on changed files.
- `yarn run prettier:all` - run Prettier on all files.
- `yarn run test:run` - run all test suites.
- `yarn run test:watch` - run all test suites but watch for changes and rerun tests when they change.
- `yarn run test:coverage` - run all test suites and enable coverage report.
- `coverage:open` - open coverage report in browser.
- `yarn run test:coverage:open` - run all test suites and enable coverage report then open coverage report in browser.

[shields-react-router-domain]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[shields-react-query-domain]: https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white
[shields-zustand-domain]: https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[shields-typescript-domain]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[shields-fsd-domain]: https://img.shields.io/badge/Feature--Sliced-Design?style=for-the-badge&color=F2F2F2&labelColor=262224&logoWidth=10&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAaCAYAAAC3g3x9AAAACXBIWXMAAALFAAACxQGJ1n/vAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABISURBVHgB7dKxCQAgDETR0w2cws0cys2cwhEUBbsggikCuVekDHwSQFlYo7Q+8KnmtHdFWMdk2cl5wSsbxGSZw8dm8pX9ZHUTMBUgGU2F718AAAAASUVORK5CYII=
[shields-vite-domain]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[shields-react-domain]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[netlify-domain]: https://api.netlify.com/api/v1/badges/5d5013c3-ec61-4496-8f48-caa7145fb166/deploy-status
