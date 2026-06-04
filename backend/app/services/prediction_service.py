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
    probs, threshold = predict(df)
    prob = float(probs[0])

    LGD = threshold
    loan_amnt = data.get("loan_amnt", 0)
    expected_loss = prob * LGD * loan_amnt   


    return {
        "probability": prob,
        "pred_status": 1 if (prob > threshold) else 0, 
        "expected_loss": float(expected_loss),
        "threshold": threshold,
        "decision": "Reject" if prob > threshold or expected_loss > 10000 else "Approve",
        "risk": "High Risk" if (prob > threshold) else "Low Risk"
    }

def run_bulk_prediction(df):
    probs, threshold = predict(df[feature_columns])

    LGD = threshold
    df["pred_probability"] = probs
    df["threshold"] = threshold
    df["expected_loss"] = df["pred_probability"] * LGD * df["loan_amnt"]
    
    df["pred_status"] = (df["pred_probability"] > threshold).astype(int)
    
    # Vectorized decision and risk
    df["decision"] = df.apply(
        lambda row: "Reject" if row["pred_probability"] > threshold or row["expected_loss"] > 10000 else "Approve",
        axis=1
    )
    df["risk"] = df.apply(
        lambda row: "High Risk" if row["pred_probability"] > threshold else "Low Risk",
        axis=1
    )
    
    return df
