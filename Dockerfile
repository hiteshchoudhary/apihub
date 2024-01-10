FROM node

RUN mkdir -p /usr/src/freeapi && chown -R node:node /usr/src/freeapi

WORKDIR /usr/src/freeapi

# Copy package json and yarn lock only to optimize the image building
COPY package.json yarn.lock ./

# copy prepare.js prior. It will be executed after package installation and before ROOT dir is cloned
COPY prepare.js ./

USER node

RUN yarn install --pure-lockfile

# Install the cors package
RUN yarn add cors

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "start" ]
