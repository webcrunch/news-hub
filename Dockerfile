# Step 1: Build stage
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Step 2: Production stage
FROM nginx:stable-alpine AS production

# Rensa bort Nginx standard-sidor (så att "Welcome to nginx!" försvinner för alltid)
RUN rm -rf /usr/share/nginx/html/*

# Kopiera dina byggda filer direkt till Nginxs rotkatalog
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiera din custom nginx.conf till containern
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]