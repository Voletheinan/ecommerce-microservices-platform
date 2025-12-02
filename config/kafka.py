"""
Kafka utilities for message streaming
"""
import json
from kafka import KafkaProducer, KafkaConsumer
from kafka.errors import KafkaError
from .settings import KAFKA_BROKER
import logging

logger = logging.getLogger(__name__)

class KafkaService:
    def __init__(self):
        self.producer = None
        self.consumers = {}
    
    def get_producer(self):
        """Get or create Kafka producer"""
        if self.producer is None:
            try:
                self.producer = KafkaProducer(
                    bootstrap_servers=[KAFKA_BROKER],
                    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                    acks='all',
                    retries=3
                )
                logger.info("Kafka producer connected")
            except Exception as e:
                logger.error(f"Failed to connect Kafka producer: {e}")
        return self.producer
    
    def publish_event(self, topic: str, message: dict):
        """Publish event to Kafka topic"""
        try:
            producer = self.get_producer()
            future = producer.send(topic, value=message)
            record_metadata = future.get(timeout=10)
            logger.info(f"Event published to {topic}: {message}")
            return True
        except KafkaError as e:
            logger.error(f"Failed to publish event: {e}")
            return False
    
    def get_consumer(self, topic: str, group_id: str):
        """Get or create Kafka consumer"""
        key = f"{topic}_{group_id}"
        if key not in self.consumers:
            try:
                consumer = KafkaConsumer(
                    topic,
                    bootstrap_servers=[KAFKA_BROKER],
                    group_id=group_id,
                    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                    auto_offset_reset='earliest',
                    enable_auto_commit=True
                )
                self.consumers[key] = consumer
                logger.info(f"Kafka consumer created for {topic}")
            except Exception as e:
                logger.error(f"Failed to create consumer: {e}")
        return self.consumers.get(key)
    
    def close(self):
        """Close all connections"""
        if self.producer:
            self.producer.close()
        for consumer in self.consumers.values():
            consumer.close()

kafka_service = KafkaService()
