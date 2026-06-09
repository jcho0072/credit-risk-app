import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import  accuracy_score, confusion_matrix, classification_report, ConfusionMatrixDisplay, f1_score, roc_curve, roc_auc_score, PrecisionRecallDisplay, precision_recall_curve
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import OrdinalEncoder
from sklearn.base import BaseEstimator, TransformerMixin
from shared.feature_engineering import FeatureEngineer
import category_encoders as ce

import joblib
import argparse
import os
import json

from backend.app.config.paths import DATABASE_URL, MODEL_PATH


engine = create_engine(
    DATABASE_URL
)

chunks = []
for chunk in pd.read_sql("SELECT * FROM loan_applications", engine, chunksize=10000):
    chunks.append(chunk)

# Reconstruct the dataset
df = pd.concat(chunks, ignore_index=True)


# Feature Transformation 
numeric_cols = [
                "person_age", 
                "person_income",
                "person_emp_length",
                "loan_amnt",
                "loan_int_rate", 
                "loan_percent_income",
                "cb_person_default_on_file", 
                "cb_person_cred_hist_length",
                
                "loan_income_ratio",
                "income_per_emp_year",
                "cred_hist_to_age_ratio",
                "rate_x_loan",
                "emp_length_ratio"
                ]




categorical_cols = [
                    "person_home_ownership", 
                    "loan_intent",
                    "emp_stability"
                   ]




num_pipeline = Pipeline([
                            ("imputer",SimpleImputer(strategy="mean")),
                            ("scaler", StandardScaler())
                        ])

col_pipeline = Pipeline([
                            ("imputer",SimpleImputer(strategy="most_frequent")),
                            ("encoder", OneHotEncoder(handle_unknown="ignore"))
                        ])

ordinal_pipeline = Pipeline([
                            ("imputer",SimpleImputer(strategy="most_frequent")),
                            ("encoder", OrdinalEncoder())
                        ])


transformer = ColumnTransformer([
                                    ("num", num_pipeline, numeric_cols), 
                                    ("cat", col_pipeline ,categorical_cols),
                                    ("ord", ordinal_pipeline, ["loan_grade"])
                                ])



X = df.drop("loan_status", axis = 1)
y = df["loan_status"]



# Train test Split
X_train, X_test, y_train, y_test = train_test_split(X, y,  test_size=0.2, random_state=42)


# Training
pipeline = Pipeline([("feature_engineering", FeatureEngineer()),
                    ("preprocessor", transformer), 
                    ("model", RandomForestClassifier(max_depth=5, class_weight="balanced" ,random_state=42))])

pipeline.fit(X_train, y_train)

# Testing
y_pred_train = pipeline.predict(X_train)

y_prob = pipeline.predict_proba(X_test)[:, 1]

# Threshold determining
best_t = 0
best_score = 0
best_pred = None

for t in np.linspace(0.1, 0.9, 50):
    y_pred = (y_prob > t).astype(int)
    score = f1_score(y_test, y_pred)

    if score > best_score:
        best_score = score
        best_t = t
        best_pred = y_pred

print("Best threshold:", best_t)

joblib.dump({
    "model": pipeline,
    "threshold": best_t
}, MODEL_PATH)


# Classification report 
report = classification_report(y_test, best_pred, output_dict=True)
df_report = pd.DataFrame(report).transpose()
print(df_report)



# Visualization 

# Save metrics to JSON file
os.makedirs("ml/diagnostics", exist_ok=True)

# Accuracy
print("Train accuracy: ", accuracy_score(y_train, y_pred_train))
print("Test acccuracy: ", accuracy_score(y_test, best_pred))

# Confusion matrix
ConfusionMatrixDisplay.from_predictions(y_test, best_pred)
plt.title(f"Confusion Matrix - Threshold {best_t}")

plt.savefig(f"ml/diagnostics/confusion_matrix.png", dpi=300, bbox_inches='tight')
plt.close()



# ROC/ ROC-AUC
fpr, tpr, __ = roc_curve(y_test, y_prob)

plt.figure()
plt.plot(fpr,tpr)
plt.plot([0,1],[1,0], linestyle="--")
plt.xlabel("False positive rate")
plt.ylabel("True positive rate")
plt.title("ROC curve")
plt.savefig(f"ml/diagnostics/ROC-curve.png", dpi=300, bbox_inches='tight')
plt.close()

print("ROC-AUC", roc_auc_score(y_test, y_prob)) 


# Precision
precision, recall, _ = precision_recall_curve(y_test,y_prob)

plt.figure()
plt.plot(recall,precision)
plt.xlabel("Recall")
plt.ylabel("Precision")
plt.title("Precision-Recall Curve")
plt.savefig(f"ml/diagnostics/Precision-Recall-Curve.png", dpi=300, bbox_inches='tight')
plt.close()

# Alt method

# PrecisionRecallDisplay.from_estimator(
#     pipeline,
#     X_test,
#     y_test,
#     name="GradientBoosting"
# )

# plt.title("Precision-Recall Curve")
# plt.show()    



# Cross Validation scores

# Initialize parser
parser = argparse.ArgumentParser(description="Train Credit Risk Model")
# Add boolean flag (--run-cv)
parser.add_argument(
    "--run-cv",
    action="store_true",  # If the flag is present, set it to True; otherwise False
    help="Run cross-validation (takes longer)"
)
args = parser.parse_args()



metrics = {
    "train_accuracy": float(accuracy_score(y_train, y_pred_train)),
    "test_accuracy": float(accuracy_score(y_test, best_pred)),
    "roc_auc": float(roc_auc_score(y_test, y_prob)),
    "best_threshold": float(best_t)
}



 # Cross Validation scores only if flag is turned on 
if args.run_cv:
    print("Running cross-validation...")
    scores = cross_val_score(pipeline, X, y, cv=5, scoring="f1")
    metrics["cv_f1_scores"] = [float(s) for s in scores]
    metrics["mean_cv_f1"] = float(scores.mean())
else:
    print("Skipping cross-validation (use '--run-cv' flag to enable).")




with open("ml/diagnostics/metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)

print("Metrics saved to ml/diagnostics/metrics.json")



# print("F1 scores", scores)
# print("Mean F1:", scores.mean())




