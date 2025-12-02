FROM python:3.10-slim
WORKDIR /app
COPY favourite-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY favourite-service /app/
EXPOSE 8010
CMD ["python", "main.py"]
