FROM node:18.2 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:1.21.6-alpine

COPY --from=builder /app/dist/web /usr/share/nginx/html
