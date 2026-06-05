from flask import Blueprint, jsonify, request
from sqlalchemy import text
from backend.app.models.loan_applications import LoanApplications
from backend.app.extensions import db

import math

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/loss-by-grade", methods=["GET"])
def get_loss_by_grade():
    results = db.session.execute(text("SELECT * FROM v_loss_by_grade")).fetchall()
    return jsonify({
        "data": [row._mapping for row in results],
        "error": None
    }), 200

@analytics_bp.route("/default-rate-by-intent", methods=["GET"])
def get_default_rate_by_intent():
    results = db.session.execute(text("SELECT * FROM v_default_rate_by_intent")).fetchall()
    return jsonify({
        "data": [row._mapping for row in results],
        "error": None
    }), 200

@analytics_bp.route("/loan-amount-by-grade", methods=["GET"])
def get_loan_amount_by_grade():
    results = db.session.execute(text("SELECT * FROM v_loan_amount_by_grade")).fetchall()
    return jsonify({
        "data": [row._mapping for row in results],
        "error": None
    }), 200
