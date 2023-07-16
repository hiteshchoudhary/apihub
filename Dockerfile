FROM node

RUN mkdir -p /usr/src/freeapi && chown -R node:node /usr/src/freeapi

WORKDIR /usr/src/freeapi

# Copy package json and yarn lock only to optimise the image building
COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "start" ]