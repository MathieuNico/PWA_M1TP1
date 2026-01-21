# Build stage
FROM node:20 AS build

WORKDIR /src

# Copy package files
COPY package*.json ./

# Install dependencies (using legacy-peer-deps for Nuxt 4 ecosystem conflicts)
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Copy output from build stage
COPY --from=build /src/.output ./.output

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 3000

# Start the application using the standalone server
CMD ["node", ".output/server/index.mjs"]
