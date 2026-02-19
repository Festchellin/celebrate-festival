FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g npm@11
COPY package*.json ./
RUN npm install --force --registry https://registry.npmmirror.com/
COPY . .
RUN npm run build

FROM caddy:2-alpine

COPY --from=builder /app/dist/index.html /usr/share/caddy/
COPY --from=builder /app/dist/assets /usr/share/caddy/assets
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
