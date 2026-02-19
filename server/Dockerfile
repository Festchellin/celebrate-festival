FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY dist ./dist/

RUN npm ci --omit=dev --registry https://registry.npmmirror.com/

RUN npx prisma generate

EXPOSE 3001

CMD ["node", "dist/index.js"]
