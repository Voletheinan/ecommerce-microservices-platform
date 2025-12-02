FROM python:3.10-slim

WORKDIR /app

COPY discovery-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY config /app/config
COPY discovery-service /app/

EXPOSE 8000

CMD ["python", "main.py"]
