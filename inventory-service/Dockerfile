FROM python:3.10-slim
WORKDIR /app
COPY inventory-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY inventory-service /app/
EXPOSE 8005
CMD ["python", "main.py"]
