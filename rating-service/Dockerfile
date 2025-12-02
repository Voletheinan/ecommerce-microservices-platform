FROM python:3.10-slim
WORKDIR /app
COPY rating-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY rating-service /app/
EXPOSE 8008
CMD ["python", "main.py"]
