# Step 1: Build stage
FROM node:24-alpine AS build
WORKDIR /app

# Kopiera package.json (och package-lock.json om den finns)
COPY package*.json ./

# ÄNDRING HÄR: Använd vanliga install istället för ci. 
# Då installerar Node exakt de @emnapi-paket som behövs för Alpine Linux!
RUN npm install

COPY . .
RUN npm run build

# Step 2: Production stage
FROM nginx:stable-alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]