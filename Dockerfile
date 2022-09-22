FROM node:18-alpine as build
WORKDIR /build
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine as prod
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY  --from=build /build/dist ./dist
ENTRYPOINT node dist/backend/server.js