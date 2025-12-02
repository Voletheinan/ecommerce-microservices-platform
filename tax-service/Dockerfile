FROM python:3.10-slim
WORKDIR /app
COPY tax-service/requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY config /app/config
COPY tax-service /app/
EXPOSE 8012
CMD ["python", "main.py"]
