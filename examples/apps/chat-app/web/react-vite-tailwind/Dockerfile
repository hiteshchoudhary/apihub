# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY .env ./.env

# Install dependencies
RUN npm install

# Copy the entire application to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the server
CMD ["npm", "run", "dev"]