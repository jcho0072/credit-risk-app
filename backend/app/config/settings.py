from backend.app.config.paths import DEV_DATABASE_URL, PROD_DATABASE_URL, MODEL_PATH

class Config:
    """Base Configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MODEL_PATH = MODEL_PATH

class DevelopmentConfig(Config):
    """Local Development Configuration"""
    SQLALCHEMY_DATABASE_URI = DEV_DATABASE_URL

class TestingConfig(Config):
    """Test Configuration (Uses clean in-memory database)"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

class ProductionConfig(Config):
    """Production Configuration"""
     # Force PostgreSQL in production; crash immediately if DATABASE_URL is missing
    if not PROD_DATABASE_URL:
        raise ValueError("Missing critical environment variable: DATABASE_URL (production database URL)")
    SQLALCHEMY_DATABASE_URI = PROD_DATABASE_URL or DEV_DATABASE_URL
