# Step 1: Build stage
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Production stage
FROM nginx:stable-alpine AS production
# ÄNDRAT: Vi kopierar dist-filerna till /usr/share/nginx/html/news
COPY --from=build /app/dist /usr/share/nginx/html/news
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]