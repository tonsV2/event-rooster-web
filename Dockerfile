FROM node:15.13.0-alpine3.13 AS builder
ARG MODE=local
WORKDIR /src
ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile
ADD . .
RUN yarn build --mode $MODE

FROM nginxinc/nginx-unprivileged:1.18-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=builder /src/dist .
USER nginx
