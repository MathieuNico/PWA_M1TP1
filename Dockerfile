# Build stage
FROM node:20-alpine AS build

WORKDIR /src

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

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
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PUBLIC_DIR=/app/.output/public
ENV NODE_ENV=production

EXPOSE 3000

# Start the application
# We use the server runner directly
CMD ["node", ".output/server/index.mjs"]
