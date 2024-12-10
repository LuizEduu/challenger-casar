FROM node:22-alpine

WORKDIR /home/node/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

RUN chown -R node:node /home/node/app

USER node

COPY --chown=node:node . .

EXPOSE 3000

CMD ["pnpm", "start:dev"]