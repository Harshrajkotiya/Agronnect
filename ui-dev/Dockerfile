# Stage 1 - build the application
FROM node:18.16.0-alpine3.18 AS build
WORKDIR /app
COPY src/package*.json ./
RUN npm install
COPY src/ .

RUN npm run build

# Stage 2 - create the production image
FROM nginx:1.25.3-alpine3.18
COPY --from=build /app/dist /usr/share/nginx/html
COPY devops/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
