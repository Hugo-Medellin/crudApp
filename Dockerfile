FROM node:20.16.0-alpine3.19 AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 2: Desarrollo (opcional, solo si necesitas un entorno de desarrollo separado)
FROM node:20.16.0-alpine3.19 AS dev
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm install

# Etapa 3: Compilación
FROM node:20.16.0-alpine3.19 AS builder
ARG CONF_ENV=development
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build -- --configuration $CONF_ENV

# Etapa 4: Servidor Nginx
FROM nginx:1.26.1-alpine3.19
EXPOSE 80
COPY --from=builder /app/dist/crud-app/browser /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]