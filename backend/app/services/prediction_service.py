import pandas as pd
from backend.app.inference.model_loader import predict

feature_columns = [
        "person_age","person_income","person_home_ownership",
        "person_emp_length","loan_intent","loan_grade",
        "loan_amnt","loan_int_rate","loan_percent_income",
        "cb_person_default_on_file","cb_person_cred_hist_length"
    ]

def run_prediction(data):
    df = pd.DataFrame([{k: data.get(k) for k in feature_columns}])
    prob, threshold = predict(df)

    LGD = threshold
    loan_amnt = data.get("loan_amnt", 0)

    expected_loss = prob * LGD * loan_amnt


    return {
        "probability": float(prob),
        "loan_status": 1 if (prob > threshold) else 0,
        "expected_loss": expected_loss,
        "threshold": threshold,
        "decision": "Approve" if expected_loss < 10000 else "Reject",
        "risk": "High Risk" if (prob > threshold) else "Low Risk"
    }

