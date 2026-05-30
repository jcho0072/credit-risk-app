from flask import Flask
from flask_cors import CORS
from backend.app.extensions import db
from backend.app.config.paths import DATABASE_URL
from backend.app.routes.applications import applications_bp
import os

def create_app():
    app = Flask(__name__, static_folder="../../frontend/dist", static_url_path="/")
    
    # Configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    # Extensions
    CORS(app, origins=["http://localhost:5173", "https://credit-risk-frontend-akjw.onrender.com"])
    db.init_app(app)
    
    # Blueprints
    app.register_blueprint(applications_bp)
    
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

    with app.app_context():
        db.create_all()
        
    return app
