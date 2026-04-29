from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_cors import CORS
from shared.feature_engineering import FeatureEngineer

from backend.app.services.prediction_service import run_prediction
from backend.app.config.paths import DATABASE_URL

import os
import joblib
import pandas as pd

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder="../../frontend/dist", static_url_path="/")
CORS(app)

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")


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



# Methods
@app.route("/applications", methods = ["GET"])
def get_applications():
    try:
        applications = Financials.query.all()
        return jsonify([record.to_dict() for record in applications]), 200

    except Exception as e:
        return jsonify({
            "error:" "Failed to fetch application"
        }), 500



@app.route("/applications", methods=['POST'])
def add_applications():

    # Request type validation
    if not request.is_json:
        return jsonify({"error" : "Request must be JSON"}), 400
    
    data = request.get_json(silent=True)


    # JSON parsing validation 
    if data is None:
        return jsonify({"error" : "Invalid JSON"}), 400
    

    
    required_fields = [
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

    # Missing field validation 
    missing = [field for field in required_fields if field not in data]

    if missing:
        return jsonify({"error" : "Missing required fields",
                        "fields" : missing}), 400
    

    # Data type validation
    if not isinstance(data["person_name"], str) or not data["person_name"].strip():
        return jsonify({"error": "person_name must be a string"}), 400
    if not isinstance(data["person_age"], int):
         return jsonify({"error": "person_age must be an integer"}), 400
    

    # Value validation
    if data["loan_amnt"] <= 0:
         return jsonify({"error": "Value cannot be below 0"}), 400
    if data["loan_int_rate"] <= 0:
         return jsonify({"error": "Value cannot be below 0"}), 400
    if data["loan_percent_income"] <= 0:
         return jsonify({"error": "Value cannot be below 0"}), 400


    try:
        result = run_prediction(data)

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

        print(jsonify({"success":"successful addition"}), 201)

        return jsonify(new_record.to_dict()), 201
        
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":"Failed to create application"}), 500
    

    


    



@app.route("/applications/<int:id>", methods = ['DELETE'])
def delete_applications(id):
    application = Financials.query.get(id)

    if not application:
        return jsonify({"error":"Not found"}), 404

    db.session.delete(application)
    db.session.commit()

    return jsonify({"message":"deleted"})





@app.route("/applications/<int:id>", methods = ['PUT'])
def update_applications(id):
    data = request.json
    if not data:
        return jsonify({"error " : "Invalid data"}), 400


    application = Financials.query.get(id)
    if not application:
        return jsonify({"error":"Not found"}), 404


    allowed_fields = [
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

    for field in allowed_fields:
        if field in data:
            setattr(application, field, data[field])

    result = run_prediction(data)

    application.pred_probability = result["probability"]
    application.pred_status = result["loan_status"]
    application.expected_loss = result["expected_loss"]
    application.threshold = result["expected_loss"]
    application.decision = result["decision"]
    application.risk = result["risk"]

    db.session.commit()

    return jsonify(application.to_dict()), 201







if __name__ == "__main__":
    app.run(debug=True)