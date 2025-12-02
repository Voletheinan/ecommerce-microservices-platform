FROM nginx:latest
RUN mkdir -p /app
RUN rm -f /etc/nginx/conf.d/default.conf
COPY index.html /app/index.html
COPY api-gateway/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
