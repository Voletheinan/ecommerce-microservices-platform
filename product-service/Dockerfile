FROM python:3.10-slim
WORKDIR /app
COPY product-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY product-service /app/
EXPOSE 8002
CMD ["python", "main.py"]
