FROM nginx:latest
RUN rm -f /etc/nginx/conf.d/default.conf
COPY api-gateway/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
