# Step 1: Build stage
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Production stage
FROM nginx:stable-alpine AS production
# Kopiera dina byggda filer till /news-mappen
COPY --from=build /app/dist /usr/share/nginx/html/news

# NYTT: Kopiera din custom nginx.conf till rätt plats i containern
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]