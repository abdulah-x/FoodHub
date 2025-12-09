# Backend Dockerfile
# Use Node.js 18 LTS as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install production dependencies with retry logic
RUN npm install --only=production --loglevel=error --no-audit || \
    (echo "Retrying npm install..." && sleep 5 && npm install --only=production --loglevel=error --no-audit) || \
    (echo "Second retry..." && sleep 10 && npm install --only=production --loglevel=error --no-audit) \
    && npm cache clean --force

# Install wget for health checks
RUN apk add --no-cache wget

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy the rest of the application code
COPY . .

# Change ownership of the app directory to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port that the app runs on
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/health || exit 1

# Start the application
CMD ["node", "server.js"]