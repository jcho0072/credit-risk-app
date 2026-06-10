import os
from backend.app.config.paths import DATABASE_URL, MODEL_PATH

class Config:
    """Base Configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MODEL_PATH = MODEL_PATH

class DevelopmentConfig(Config):
    """Local Development Configuration"""
    SQLALCHEMY_DATABASE_URI = DATABASE_URL

class TestingConfig(Config):
    """Test Configuration (Uses clean in-memory database)"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

class ProductionConfig(Config):
    """Production Configuration"""
    SQLALCHEMY_DATABASE_URI = DATABASE_URL