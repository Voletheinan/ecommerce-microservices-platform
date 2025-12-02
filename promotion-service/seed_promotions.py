"""Seed promotions for promotion-service"""

from models.promotion import Promotion, Base
from datetime import datetime, timedelta
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Tạo engine synchronous, kết nối localhost vì chạy từ local
MYSQL_URL = f"mysql+pymysql://root:root123@127.0.0.1:3307/ecommerce"
engine = create_engine(MYSQL_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def seed_promotions():
    db = SessionLocal()
    promotions = [
        Promotion(
            name="Giảm giá Black Friday",
            description="Giảm giá 30% cho tất cả sản phẩm.",
            discount_percent=30.0,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=7),
            is_active=True
        ),
        Promotion(
            name="Mừng năm mới",
            description="Giảm giá 15% cho đơn hàng trên 1 triệu.",
            discount_percent=15.0,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=10),
            is_active=True
        )
    ]
    db.add_all(promotions)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_promotions()
