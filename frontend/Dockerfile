# =========================
# 1. React Build
# =========================

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .


# Kubernetes 배포용
# 기존 http://localhost:8080 요청을 /api 요청으로 변경
RUN find src -type f \( -name "*.jsx" -o -name "*.js" \) \
    -exec sed -i 's#http://localhost:8080#/api#g' {} +

RUN npm run build


# =========================
# 2. Nginx
# =========================

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]