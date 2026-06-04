import os
import joblib

from backend.app.config.paths import MODEL_PATH

bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
threshold = bundle["threshold"]

def predict(df):
    probs = model.predict_proba(df)[:, 1]
    return probs, threshold

