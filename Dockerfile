# Build stage for client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package.json ./
RUN npm install --package-lock-only
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install dependencies for sqlite3 on ARM platforms
RUN apk add --no-cache python3 make g++

# Copy server source and dependencies
COPY server/package.json ./

# Attempt to use prebuilt binaries for sqlite3 on ARM
ENV npm_config_target_arch=arm64

# Install production dependencies
RUN npm install --production

# Clean up build dependencies after installing to reduce image size
RUN apk del python3 make g++

# Copy server source code
COPY server/src ./src

# Copy client build
COPY --from=client-build /app/client/build /client/build

# Set environment variables
ENV PORT=5000

# Create output directory
RUN mkdir -p ./data/snippets

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "src/app.js"]
