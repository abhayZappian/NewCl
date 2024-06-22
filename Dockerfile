FROM node:18 as build
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build --omit=dev
FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
