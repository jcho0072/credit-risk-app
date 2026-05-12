from flask import Flask, jsonify, request, send_from_directory, g
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, inspect
from flask_cors import CORS
from shared.feature_engineering import FeatureEngineer

from backend.app.services.prediction_service import run_prediction
from backend.app.config.paths import DATABASE_URL

import os
import joblib
import math
import pandas as pd

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder="../../frontend/dist", static_url_path="/")
CORS(app)

# @app.route("/")
# def serve():
#     return send_from_directory(app.static_folder, "index.html")


app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


df = pd.DataFrame




# Database models

class Financials(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    person_name = db.Column(db.String(100), nullable = False)   
    person_age = db.Column(db.Integer, nullable = False)
    person_income = db.Column(db.Integer, nullable = False)
    person_home_ownership = db.Column(db.String(100), nullable = False)
    person_emp_length = db.Column(db.Integer, nullable = False)

    loan_intent = db.Column(db.String(100), nullable = False)
    loan_grade = db.Column(db.String(5), nullable = False)
    loan_amnt = db.Column(db.Integer, nullable = False)
    loan_int_rate = db.Column(db.Float, nullable = False)

    loan_status = db.Column(db.Integer, nullable = True) # check implementation later

    loan_percent_income = db.Column(db.Float, nullable = False)

    cb_person_default_on_file = db.Column(db.String(5), nullable = False)
    cb_person_cred_hist_length = db.Column(db.Integer, nullable = False)

    pred_probability = db.Column(db.Float, nullable = True)
    pred_status = db.Column(db.String(10), nullable = True)
    expected_loss = db.Column(db.Float, nullable = True)
    threshold = db.Column(db.Float, nullable = True)
    decision = db.Column(db.String(10), nullable = True)
    risk = db.Column(db.String(10), nullable = True)
    
    
   

    def to_dict(self):
        return {
                "id":self.id,
                "person_name":self.person_name,
                "person_age":self.person_age,
                "person_income":self.person_income,
                "person_home_ownership":self.person_home_ownership,
                "person_emp_length":self.person_emp_length,

                "loan_intent":self.loan_intent,
                "loan_grade":self.loan_grade,
                "loan_amnt":self.loan_amnt,
                "loan_int_rate":self.loan_int_rate,
                "loan_percent_income":self.loan_percent_income,

                "cb_person_default_on_file":self.cb_person_default_on_file,
                "cb_person_cred_hist_length":self.cb_person_cred_hist_length,

                "pred_probability":self.pred_probability,
                "pred_status":self.pred_status,
                "decision":self.decision,
                "risk": self.risk
        }


with app.app_context():
    db.create_all()


REQUIRED_FIELDS = [
        "person_name",
        "person_age",
        "person_income",
        "person_home_ownership",
        "person_emp_length",
        "loan_intent",
        "loan_grade",
        "loan_amnt",
        "loan_int_rate",
        "loan_percent_income",
        "cb_person_default_on_file",
        "cb_person_cred_hist_length"
    ]

FIELD_TYPES = {
    "person_name": str,
    "person_age": int,
    "person_income": int,
    "loan_int_rate": float,
    "loan_grade": str,
    "loan_amnt": int,
    "loan_int_rate": float,
    "loan_percent_income": float,
    "cb_person_default_on_file": str,
    "cb_person_cred_hist_length": int
}

FIELD_VALIDATION = {
    "person_name": lambda value: isinstance(value, str),
    "person_age": lambda value: value >= 18,
    "person_income": lambda value: value > 0,
    "person_home_ownership": lambda value: isinstance(value, str),
    "person_emp_length": lambda value: value > 0,
    "loan_intent": lambda value: isinstance(value, str),
    "loan_grade": lambda value: isinstance(value, str),
    "loan_amnt": lambda value: value >= 0 and value <= 100000,
    "loan_int_rate": lambda value: value <= 100,
    "loan_percent_income": lambda value: value <= 1,
    "cb_person_default_on_file": lambda value: isinstance(value, str),
    "cb_person_cred_hist_length": lambda value: value >= 0
}

RESULT_FIELD_MAPPING = {
    "pred_probability": "probability",
    "pred_status": "loan_status",
    "expected_loss": "expected_loss",
    "threshold": "threshold",
    "decision": "decision",
    "risk": "risk"
}


def validate_application(data):
    # Missing field validation 
    missing = [field for field in REQUIRED_FIELDS if field not in data]

    if missing:
        return {"error" : 
                    {
                        "message": "Missing required fields",
                        "code": "MISSING_FIELDS"},
                        "fields" : missing
                    }, 400
        
    if data is None:
        return {
            "data": None,
            "error" :  
                {
                    "message": "Invalid JSON",
                    "code": "INVALID_CONTENT"
                }}, 400
    

    for field, expected_type in FIELD_TYPES.items():
        if not isinstance(data[field], expected_type):
            return {
            "data": None,
            "error": 
                {
                "message": f"{field} has invalid type",
                "field": field,
                "code": "INVALID_TYPE"
                }}, 400

    for field, validator in FIELD_VALIDATION.items():
        if not validator(data[field]):
            return {
            "data": None,
            "error": {
                "message": f"{field} is of invalid value or range",
                "field": field,
                "code": "INVALID_VALUE"
            }
        }, 400




# Methods
@app.route("/applications", methods = ["GET"])
def get_applications():
    try:
        page = request.args.get("page", 1, type=int)
        limit = request.args.get("limit", 4, type=int)

        applications = (
            Financials.query
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        total_count = Financials.query.count()
        total_pages = max(1, math.ceil(total_count / limit))

        return jsonify({
                "data": [record.to_dict() for record in applications],
                "pagination": {
                    "page":page,
                    "limit":limit,
                    "totalPages":total_pages,
                    "totalCount": total_count
                },
                "error": None
            }), 200
    
    except Exception as e:
        return jsonify({
            "data": None,
            "error": {
                "message": "Failed to fetch application",
                "code": "FETCH_ERROR"}
        }), 500



@app.route("/applications", methods=['POST'])
def add_applications():
    # Request type validation
    if not request.is_json:
         return jsonify({
             "error": {
                "message": "Request must be JSON",
                "code": "INVALID_CONTENT_TYPE"}
        }), 400 
    
    data = request.get_json(silent=True)


    # JSON parsing validation 
    if data is None:
        return jsonify({"error" : 
                        {
                            "message": "No JSON Detected",
                            "code": "INVALID_JSON"
                         }
                    }), 400


    try:
        result = run_prediction(data)

        validation_error = validate_application(data)

        if validation_error:
            return jsonify({
                "data": None,
                "error": validation_error
            }), 400

        new_record = Financials(
        person_name = data["person_name"],
        person_age = data["person_age"],
        person_income = data["person_income"],
        person_home_ownership = data["person_home_ownership"],
        person_emp_length = data["person_emp_length"],

        loan_intent = data["loan_intent"],
        loan_grade = data["loan_grade"],
        loan_amnt = data["loan_amnt"],
        loan_int_rate = data["loan_int_rate"],
        loan_percent_income = data["loan_percent_income"],

        cb_person_default_on_file = data["cb_person_default_on_file"],
        cb_person_cred_hist_length = data["cb_person_cred_hist_length"],

        pred_probability = result["probability"],
        pred_status = result["loan_status"],
        expected_loss = result["expected_loss"],
        threshold = result["threshold"],
        decision = result["decision"],
        risk = result["risk"]
    )
        
        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            "data": new_record.to_dict(),
            "error": None
        }), 201
        
    
    except Exception as e:
        db.session.rollback()
        return jsonify(
            {   "data": None,
                "error":
                        {
                            "message":"Failed to create application",
                            "code":"CREATE_ERROR"
                        }}), 500



@app.route("/applications/<int:id>", methods = ['DELETE'])
def delete_applications(id):
    application = Financials.query.get(id)

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

    return jsonify({"message":"deleted"})


# @app.route("/applications", methods=["DELETE"])
# def delete_all_applications():
#     try:
#         Financials.query.delete()
#         db.session.commit()

#         return {"message": "All applications deleted"}, 200

#     except Exception as e:
#         db.session.rollback()
#         return {"error": "Failed to delete applications"}, 500


@app.route("/applications/<int:id>", methods = ['PUT'])
def update_applications(id):
    # Request type validation
    if not request.is_json:
         return jsonify({
             "error": {
                "message": "Request must be JSON",
                "code": "INVALID_CONTENT_TYPE"}
        }), 400 
    
    data = request.get_json(silent=True)

    # JSON parsing validation 
    if data is None:
        return jsonify({"error" : 
                        {
                            "message": "No JSON Detected",
                            "code": "INVALID_JSON"
                         }
                    }), 400
    
    validation_error = validate_application(data)

    # Field Validation handling
    if validation_error:
            return jsonify({
                "data": None,
                "error": validation_error
            }), 400

    application = Financials.query.get(id)

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
        setattr(
            application,
            field,
            result[value]
        )

    db.session.commit()

    return jsonify({
            "data": application.to_dict(),
            "error": None
        }), 200







if __name__ == "__main__":
    app.run(debug=True)