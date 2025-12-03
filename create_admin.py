#!/usr/bin/env python3
"""
Create admin user script
"""
import sys
import os

# Change to the correct directory
os.chdir(os.path.join(os.path.dirname(__file__), 'user-service'))
sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'config'))

from config.database import SessionLocal, engine
from models.user import Base, User
from services.user_service import UserService

def create_admin():
    """Create admin user"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if admin exists
        admin = db.query(User).filter(User.username == "admin").first()
        if admin:
            print("✓ Admin user already exists!")
            print(f"  ID: {admin.id}")
            print(f"  Email: {admin.email}")
            print(f"  Role: {admin.role}")
            return
        
        # Create admin user
        hashed_password = UserService.hash_password("admin123")
        admin_user = User(
            email="admin@example.com",
            username="admin",
            hashed_password=hashed_password,
            full_name="Administrator",
            phone="0999999999",
            address="Admin Street",
            role="admin",
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✓ Admin user created successfully!")
        print(f"  ID: {admin_user.id}")
        print(f"  Email: {admin_user.email}")
        print(f"  Username: admin")
        print(f"  Password: admin123")
        print(f"  Role: {admin_user.role}")
        
    except Exception as e:
        print(f"✗ Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
