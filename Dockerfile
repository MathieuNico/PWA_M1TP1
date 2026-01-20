# Build stage
FROM node:20-alpine AS build

WORKDIR /src

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy output from build stage
COPY --from=build /src/.output ./.output

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
