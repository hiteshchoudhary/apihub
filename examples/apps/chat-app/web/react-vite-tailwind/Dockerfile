# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy static files to the Nginx server directory
COPY ./dist/. /usr/share/nginx/html

# Expose port 3000
EXPOSE 80

# Command to start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
