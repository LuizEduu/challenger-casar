FROM node:22-alpine AS build

RUN apk update && apk add --no-cache openssl bash

WORKDIR /home/node/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

FROM node:22-alpine

RUN apk update && apk add --no-cache openssl bash \
    && npm install -g pnpm

WORKDIR /home/node/app

COPY --from=build /home/node/app /home/node/app

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

USER node

EXPOSE 3000

CMD ["/bin/sh", "-c", "/wait-for-it.sh postgres:5432 -- pnpm prisma migrate dev && pnpm start:dev"]