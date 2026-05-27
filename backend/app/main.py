from flask import Flask, jsonify, request, send_from_directory, g
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
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

CORS(app, origins= ["http://localhost:5173",
                    "https://credit-risk-frontend-akjw.onrender.com"])

# @app.route("/")
# def serve():
#     return send_from_directory(app.static_folder, "index.html")


app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

print(app.config["SQLALCHEMY_DATABASE_URI"])

db = SQLAlchemy(app)


df = pd.DataFrame




# Database models

class Financials(db.Model):
    person_id = db.Column(db.Integer, primary_key = True)
    person_name = db.Column(db.String(30), nullable = False)   
    person_age = db.Column(db.Integer, nullable = False)
    person_income = db.Column(db.Float, nullable = False)
    person_home_ownership = db.Column(db.String(20), nullable = False)
    person_emp_length = db.Column(db.Integer, nullable = False)

    loan_intent = db.Column(db.String(20), nullable = False)
    loan_grade = db.Column(db.String(5), nullable = False)
    loan_amnt = db.Column(db.Float, nullable = False)
    loan_int_rate = db.Column(db.Float, nullable = False)
    loan_status = db.Column(db.Integer, nullable = True) 
    loan_percent_income = db.Column(db.Float, nullable = False)

    cb_person_default_on_file = db.Column(db.String(5), nullable = False)
    cb_person_cred_hist_length = db.Column(db.Integer, nullable = False)

    pred_probability = db.Column(db.Float, nullable = True)
    pred_status = db.Column(db.String(10), nullable = True)   
    expected_loss = db.Column(db.Float, nullable = True)
    threshold = db.Column(db.Float, nullable = True)
    decision = db.Column(db.String(20), nullable = True)
    risk = db.Column(db.String(20), nullable = True)
    
    

    def to_dict(self):
        return {     
                "person_id":self.person_id,
                "person_name":self.person_name,
                "person_age":self.person_age,
                "person_income":self.person_income,
                "person_home_ownership":self.person_home_ownership,
                "person_emp_length":self.person_emp_length,

                "loan_intent":self.loan_intent,
                "loan_grade":self.loan_grade,
                "loan_amnt":self.loan_amnt,
                "loan_int_rate":self.loan_int_rate,
                "loan_status":self.loan_status,
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
    db.session.execute(text("SELECT 1"))
    print("Render PostgreSQL connected successfully")


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
        "loan_status",
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
    "loan_status": int, 
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
    "loan_status": lambda value: value == 1 or value == 0,  # check this 
    "loan_percent_income": lambda value: value <= 1,
    "cb_person_default_on_file": lambda value: isinstance(value, str),
    "cb_person_cred_hist_length": lambda value: value >= 0
}

RESULT_FIELD_MAPPING = {  
    "pred_probability": "probability",
    "pred_status": "pred_status",
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
                "message": str(e),
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
        validation_error = validate_application(data)
        result = run_prediction(data)


        if validation_error:
            return jsonify({
                "data": None,
                "error": validation_error
            }), 400

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
        return jsonify(
            {   "data": None,
                "error":
                        {
                            
                            "message": str(e),
                            "code":"CREATE_ERROR"
                        }}), 500



@app.route("/applications/<int:person_id>", methods = ['DELETE'])
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


@app.route("/applications/<int:person_id>", methods = ['PUT'])
def update_applications(person_id):
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