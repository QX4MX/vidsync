FROM node:12-alpine as build
WORKDIR /build
COPY package.json ./
RUN npm install
COPY . .
RUN npm run ng-build

FROM node:12-alpine as prod
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY  --from=build /build/dist ./dist
