FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json webpack.config.js ./
COPY src ./src
COPY public ./public

ARG API_URL
ENV API_URL=${API_URL}

RUN yarn build:prod

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY ops/deploy/docker/nginx.conf /etc/nginx/nginx.conf

ARG VERSION
ARG BUILD_DATE
ARG GIT_COMMIT

LABEL org.opencontainers.image.source="https://github.com/yurisldk/realworld-react-fsd" \
      org.opencontainers.image.url="https://github.com/yurisldk/realworld-react-fsd" \
      org.opencontainers.image.documentation="https://github.com/yurisldk/realworld-react-fsd#readme" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${GIT_COMMIT}" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.title="realworld"
