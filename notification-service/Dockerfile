FROM python:3.10-slim
WORKDIR /app
COPY notification-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY notification-service /app/
EXPOSE 8011
CMD ["python", "main.py"]
