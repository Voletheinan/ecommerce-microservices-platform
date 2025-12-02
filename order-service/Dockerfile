FROM python:3.10-slim
WORKDIR /app
COPY order-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY order-service /app/
EXPOSE 8003
CMD ["python", "main.py"]
