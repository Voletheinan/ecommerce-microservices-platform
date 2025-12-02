FROM python:3.10-slim
WORKDIR /app
COPY promotion-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY promotion-service /app/
EXPOSE 8007
CMD ["python", "main.py"]
