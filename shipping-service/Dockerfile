FROM python:3.10-slim
WORKDIR /app
COPY shipping-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY shipping-service /app/
EXPOSE 8006
CMD ["python", "main.py"]
