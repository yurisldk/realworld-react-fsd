# Demo Deployment Setup

This directory contains resources for launching a demo version of the RealWorld fullstack application using Docker Compose.

## Overview

This demo environment is configured to run both the frontend from [realworld-react-fsd](https://github.com/yurisldk/realworld-react-fsd) and the backend API from [node-express-realworld-example-app](https://github.com/yurisldk/node-express-realworld-example-app) together in a unified fullstack setup.

This setup is intended for local testing, development previews, or showcasing the fullstack architecture of the application.

## Services

- **frontend** — React-based frontend client
- **api** — Node.js/Express backend API with Prisma and PostgreSQL
- **db** — PostgreSQL database for persistent storage
- **pgadmin** — Admin UI for managing PostgreSQL

## Usage

1. A `.env` file with predefined values is already provided in this directory. No additional setup is required.

2. Start the environment:

   ```bash
   docker-compose up --build
   ```

3. Access the services:
   - Frontend: http://localhost:30401
   - API: http://localhost:30400
   - PgAdmin: http://localhost:30433

## Notes

- PostgreSQL data is persisted via named volumes.
- Images are pulled from GitHub Container Registry (GHCR).
- Ensure Docker supports `linux/amd64` platform if you're on ARM-based systems like Apple Silicon.

## Cleanup

To stop and remove containers, networks, and volumes:

```bash
docker-compose down -v
```
