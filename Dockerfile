FROM node

RUN mkdir -p /usr/src/apihub && chown -R node:node /usr/src/apihub

WORKDIR /usr/src/apihub

# Copy package json and yarn lock only to optimise the image building
COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "start" ]