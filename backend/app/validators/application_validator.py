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
    "loan_status": lambda value: value == 1 or value == 0,
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
    if data is None:
        return {
            "error": {
                "message": "No JSON Detected",
                "code": "INVALID_JSON"
            }
        }, 400

    # Missing field validation 
    missing = [field for field in REQUIRED_FIELDS if field not in data]

    if missing:
        return {
            "error": {
                "message": "Missing required fields",
                "code": "MISSING_FIELDS"
            },
            "fields": missing
        }, 400
    

    for field, expected_type in FIELD_TYPES.items():
        if field in data and not isinstance(data[field], expected_type):
            return {
                "error": {
                    "message": f"{field} has invalid type",
                    "field": field,
                    "code": "INVALID_TYPE"
                }
            }, 400

    for field, validator in FIELD_VALIDATION.items():  
        if field in data and not validator(data[field]):
            return {
                "error": {
                    "message": f"{field} is of invalid value or range",
                    "field": field,
                    "code": "INVALID_VALUE"
                }
            }, 400
    
    return None
