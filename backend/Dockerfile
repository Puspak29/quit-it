FROM node:22-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY ./package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build


FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN npm prune --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 8080

CMD ["sh", "-c", "echo $DATABASE_URL npx prisma migrate deploy && npm run db:seed && npm start"]