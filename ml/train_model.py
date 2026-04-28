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
import os 

from backend.app.config.paths import MODEL_PATH


engine = create_engine(
    "oracle+oracledb://ml_user:ml_password@localhost:1521?service_name=XEPDB1"
)

df = pd.read_sql("SELECT * FROM CREDIT_DATA", engine)



# print(df.head())

# print()
# print(df.info())


# print()
# print(df.describe())



# print(df.isnull().sum())
# np.isinf(df.select_dtypes(include=[float])).sum()



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
    "threshold": 0.4
}, MODEL_PATH)


# Classification report 
report = classification_report(y_test, best_pred, output_dict=True)
df_report = pd.DataFrame(report).transpose()
print(df_report)



# Visualization 

# baseline = y_test.mean()
# print("Baseline: ", baseline)

# Accuracy
print("Train accuracy: ", accuracy_score(y_train, y_pred_train))
print("Test acccuracy: ", accuracy_score(y_test, y_pred))

# Confusion matrix
ConfusionMatrixDisplay.from_predictions(y_test, y_pred)
plt.show()



# ROC/ ROC-AUC
fpr, tpr, __ = roc_curve(y_test, y_prob)

plt.plot(fpr,tpr)
plt.plot([0,1],[1,0], linestyle="--")
plt.xlabel("False positive rate")
plt.ylabel("True positive rate")
plt.title("ROC curve")
plt.show()

print("ROC-AUC", roc_auc_score(y_test, y_prob))
plt.show()





# Precision
precision, recall, _ = precision_recall_curve(y_test,y_prob)

plt.plot(recall,precision)
plt.xlabel("Recall")
plt.ylabel("Precision")
plt.title("Precision-Recall Curve")
plt.show()


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

scores= cross_val_score(pipeline, X, y, cv = 5, scoring = "f1")

print("F1 scores", scores)
print("Mean F1:", scores.mean())




