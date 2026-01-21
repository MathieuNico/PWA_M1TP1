# Build stage
FROM node:20 AS build
WORKDIR /src
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim AS production
WORKDIR /app
# Importance : On copie TOUT .output pour que Nitro ait sa structure complète
COPY --from=build /src/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Utilisation directe du serveur Nitro
CMD ["node", ".output/server/index.mjs"]
