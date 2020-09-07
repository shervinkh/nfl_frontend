# build environment
FROM node:14.9-alpine as build
ARG BACKEND_URI
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
ENV REACT_APP_BACKEND_URI $BACKEND_URI
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
