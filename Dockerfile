FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./


RUN apk add openssl
RUN openssl genrsa -out host.key 2048

USER node
RUN yarn install

COPY --chown=node:node . .

EXPOSE 8080
CMD [ "yarn", "start" ]