FROM python:3.10-slim
WORKDIR /app
COPY user-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY user-service /app/
EXPOSE 8001
CMD ["python", "main.py"]
