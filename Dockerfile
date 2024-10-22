# Build stage for client
FROM node:16-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build stage for server
FROM node:16-alpine AS server-build
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Production stage
FROM node:16-alpine
WORKDIR /app

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Copy server build and dependencies
COPY --from=server-build /app/server/dist ./dist
COPY --from=server-build /app/server/package*.json ./
RUN npm install --production

# Copy client build
COPY --from=client-build /app/client/build ./client/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV PGUSER=bytestash
ENV PGHOST=db
ENV PGPASSWORD=bytestash-password123
ENV PGDATABASE=snippets_db
ENV PGPORT=5432
ENV OUTPUT_DIR=/data/snippets

# Create output directory
RUN mkdir -p ${OUTPUT_DIR}

EXPOSE 5000

CMD ["node", "dist/app.js"]