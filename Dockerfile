FROM node:20.13.1-alpine

# Add build arguments for more flexibility
ARG NODE_ENV=production
ARG APP_DIR=/usr/src/freeapi

# Set environment variables
ENV NODE_ENV=${NODE_ENV} \
    APP_DIR=${APP_DIR}

# Create app directory and set proper ownership
WORKDIR ${APP_DIR}

# Install dependencies as root first
COPY package.json yarn.lock ./
COPY prepare.js ./

# Install dependencies with yarn
RUN yarn install --pure-lockfile --frozen-lockfile && \
    # Add yarn cache cleanup to reduce image size
    yarn cache clean && \
    # Create and set proper permissions
    mkdir -p node_modules && \
    chown -R node:node .

# Switch to non-root user for security
USER node

# Copy application code with proper ownership
COPY --chown=node:node . .

# Healthcheck to verify the service is working correctly
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O- http://localhost:8080/health || exit 1

# Expose application port
EXPOSE 8080

# Use a more specific command with proper environment
CMD ["npm", "start"]
