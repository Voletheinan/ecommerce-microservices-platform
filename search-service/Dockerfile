FROM python:3.10-slim
WORKDIR /app
COPY search-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY search-service /app/
EXPOSE 8009
CMD ["python", "main.py"]
