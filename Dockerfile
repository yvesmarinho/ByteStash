# Build stage for client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy server source and dependencies
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm install --production
COPY server/src ./src

# Copy client build
COPY --from=client-build /app/client/build /client/build

# Set environment variables
ENV PORT=8500
ENV OUTPUT_DIR=/data/snippets

# Create output directory
RUN mkdir -p ${OUTPUT_DIR}

EXPOSE 8500

CMD ["node", "src/app.js"]