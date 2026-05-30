from flask import Blueprint, jsonify, request
from backend.app.models.financials import Financials
from backend.app.extensions import db
from backend.app.services.prediction_service import run_prediction
from backend.app.validators.application_validator import validate_application, REQUIRED_FIELDS, RESULT_FIELD_MAPPING

import math

applications_bp = Blueprint("applications", __name__)

@applications_bp.route("/applications", methods=["GET"])
def get_applications():
    try:
        page = request.args.get("page", 1, type=int)
        limit = request.args.get("limit", 4, type=int)
        name = request.args.get("name", "", type=str)
        risk = request.args.get("risk", "", type=str)
        loan_status = request.args.get("loan_status", type=int)
        decision = request.args.get("decision", type=str)

        if page < 1:
            page = 1
        if limit < 1:
            limit = 1
        if limit > 100:
            limit = 100

        search_query = Financials.query

        if name:
            search_query = search_query.filter(
                Financials.person_name.like(f"%{name}%")
            )
        
        if risk:
            search_query = search_query.filter(
                Financials.risk == risk
            )

        if loan_status is not None:   
            search_query = search_query.filter(
                Financials.loan_status == loan_status 
            )

        if decision:
             search_query = search_query.filter(
                 Financials.decision == decision
             )

        total_count = search_query.count()
        total_pages = max(1, math.ceil(total_count / limit))

        applications = (
            search_query
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return jsonify({
            "data": [record.to_dict() for record in applications],
            "pagination": {
                "page": page,
                "limit": limit,
                "totalPages": total_pages,
                "totalCount": total_count
            },
            "error": None
        }), 200
    
    except Exception as e:
        return jsonify({
            "data": None,
            "error": {
                "message": str(e),
                "code": "FETCH_ERROR"}
        }), 500

@applications_bp.route("/applications", methods=['POST'])
def add_applications():
    if not request.is_json:
         return jsonify({
             "error": {
                "message": "Request must be JSON",
                "code": "INVALID_CONTENT_TYPE"}
        }), 400 
    
    data = request.get_json(silent=True)

    validation_result = validate_application(data)
    if validation_result:
        return jsonify(validation_result), 400

    try:
        result = run_prediction(data)

        new_record = Financials(
            person_name = str(data["person_name"]),
            person_age = int(data["person_age"]),
            person_income = float(data["person_income"]),
            person_home_ownership = str(data["person_home_ownership"]),
            person_emp_length = int(data["person_emp_length"]),

            loan_intent = str(data["loan_intent"]),
            loan_grade = str(data["loan_grade"]),
            loan_amnt = float(data["loan_amnt"]),
            loan_int_rate = float(data["loan_int_rate"]),
            loan_status = int(data["loan_status"]),
            loan_percent_income = float(data["loan_percent_income"]),

            cb_person_default_on_file = str(data["cb_person_default_on_file"]),
            cb_person_cred_hist_length = int(data["cb_person_cred_hist_length"]),

            pred_probability = float(result["probability"]),
            pred_status = int(result["pred_status"]),    
            expected_loss = float(result["expected_loss"]),
            threshold = int(result["threshold"]),
            decision = str(result["decision"]),
            risk = str(result["risk"])
        )   
        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            "data": new_record.to_dict(),
            "error": None
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "data": None,
            "error": {
                "message": str(e),
                "code": "CREATE_ERROR"
            }
        }), 500

@applications_bp.route("/applications/<int:person_id>", methods=['DELETE'])
def delete_applications(person_id):
    application = Financials.query.get(person_id)

    if not application:
        return jsonify({
            "data": None,
            "error": {
                "message": "Application not found",
                "code": "NOT_FOUND"
            }
        }), 404

    db.session.delete(application)
    db.session.commit()

    return jsonify({"message": "deleted"}), 200

@applications_bp.route("/applications/<int:person_id>", methods=['PUT'])
def update_applications(person_id):
    if not request.is_json:
         return jsonify({
             "error": {
                "message": "Request must be JSON",
                "code": "INVALID_CONTENT_TYPE"}
        }), 400 
    
    data = request.get_json(silent=True)

    validation_result = validate_application(data)
    if validation_result:
        return jsonify(validation_result), 400

    application = Financials.query.get(int(person_id))

    if not application:
        return jsonify({
            "data": None,
            "error": {
                "message": "Application not found",
                "code": "NOT_FOUND"
            }
        }), 404    

    for field in REQUIRED_FIELDS:
        setattr(application, field, data[field])
    
    result = run_prediction(data)

    for field, value in RESULT_FIELD_MAPPING.items():
        setattr(application, field, result[value])

    db.session.commit()

    return jsonify({
        "data": application.to_dict(),
        "error": None
    }), 200
