FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile && yarn build:prod

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ops/deploy/docker/nginx.conf /etc/nginx/nginx.conf

LABEL org.opencontainers.image.source="https://github.com/yurisldk/realworld-react-fsd"