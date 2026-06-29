# Step 1: Build stage
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./

# ÄNDRAT: Vi kör npm install istället för npm ci för att hantera krocken i låsfilen
RUN npm install

COPY . .
RUN npm run build

# Step 2: Production stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]