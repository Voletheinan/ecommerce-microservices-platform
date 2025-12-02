FROM python:3.10-slim
WORKDIR /app
COPY payment-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY payment-service /app/
EXPOSE 8004
CMD ["python", "main.py"]
