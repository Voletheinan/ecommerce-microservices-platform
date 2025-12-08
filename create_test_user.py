#!/usr/bin/env python3
"""
Create test user script
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

def create_test_user():
    """Create test user"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if test user exists
        test_user = db.query(User).filter(User.email == "testing@gmail.com").first()
        if test_user:
            print("✓ Test user already exists!")
            print(f"  ID: {test_user.id}")
            print(f"  Email: {test_user.email}")
            print(f"  Username: {test_user.username}")
            print(f"  Full Name: {test_user.full_name}")
            print(f"  Role: {test_user.role}")
            return
        
        # Create test user
        hashed_password = UserService.hash_password("123123")
        new_user = User(
            email="testing@gmail.com",
            username="testuser",
            hashed_password=hashed_password,
            full_name="Test User",
            phone="0123456789",
            address="Test Address",
            role="client",
            is_active=True
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("✓ Test user created successfully!")
        print(f"  ID: {new_user.id}")
        print(f"  Email: {new_user.email}")
        print(f"  Username: {new_user.username}")
        print(f"  Password: 123123")
        print(f"  Full Name: {new_user.full_name}")
        print(f"  Role: {new_user.role}")
        
    except Exception as e:
        print(f"✗ Error creating test user: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()

