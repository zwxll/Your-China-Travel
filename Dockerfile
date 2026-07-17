# ============================================================
# Dockerfile —— Nginx 容器化部署（局域网/公网均可）
# 构建命令： docker build -t china-travel .
# 运行命令： docker run -d -p 8080:80 --name china-travel china-travel
# 访问地址： http://本机IP:8080
# ============================================================
FROM nginx:alpine

# 清空默认页面，复制部署文件到 Nginx 静态目录
RUN rm -rf /usr/share/nginx/html/*
COPY index.html /usr/share/nginx/html/index.html

# 用自定义 nginx 配置覆盖默认配置（开启 gzip + 静态回退）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
