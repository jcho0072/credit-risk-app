from flask import Flask
from flask_cors import CORS
from backend.app.extensions import db, migrate
from backend.app.routes.applications import applications_bp
from backend.app.routes.analytics import analytics_bp
import os

def create_app(config_name=None):
    app = Flask(__name__, static_folder="../../frontend/dist", static_url_path="/")
    
    # Configuration
     # Load configuration dynamically
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")
    if config_name == "testing":
        app.config.from_object("backend.app.config.settings.TestingConfig")
    elif config_name == "production":
        app.config.from_object("backend.app.config.settings.ProductionConfig")
    else:
        app.config.from_object("backend.app.config.settings.DevelopmentConfig")
    
    # Extensions
    CORS(app, origins=["http://localhost:5173", "https://credit-risk-frontend-akjw.onrender.com"])
    db.init_app(app)

    # Migrations 
    migrate.init_app(app, db, directory="backend/migrations")
    
    # Blueprints
    app.register_blueprint(applications_bp)
    app.register_blueprint(analytics_bp, url_prefix="/analytics") # url_prefix exposes endpoints in analytics.py

    # CLI Commands
    from backend.app.commands import ingest_data
    app.cli.add_command(ingest_data)
    
    # Debug route (can be restricted later) 
    @app.route("/debug-db")
    def debug_db():
        from sqlalchemy import text
        result = db.session.execute(
            text("SELECT current_user, current_database()")
        ).fetchone()
        return {
            "user": result[0],
            "database": result[1]
        }

    # with app.app_context():
    #     print(f"--- CONNECTED TO: {db.engine.url.drivername} ---")
    #     db.create_all()
        
    return app
