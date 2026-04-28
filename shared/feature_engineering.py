# Feature engineering 
from sklearn.base import BaseEstimator, TransformerMixin
import numpy as np


class FeatureEngineer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        X = X.copy()

        # Debt-to-income ratio
        X["loan_income_ratio"] = X["loan_amnt"] / X["person_income"]
        X["loan_income_ratio"].replace([np.inf, -np.inf], np.nan, inplace=True) # for now ill clean a bit more later

        # Income per employment year
        X["income_per_emp_year"] = X["person_income"] / (X["person_emp_length"] + 1)
        X["income_per_emp_year"].replace([np.inf, -np.inf], np.nan, inplace=True) # for now ill clean a bit more later


        # Credit maturity ratio
        X["cred_hist_to_age_ratio"] = X["cb_person_cred_hist_length"] / X["person_age"]
        X["cred_hist_to_age_ratio"].replace([np.inf, -np.inf], np.nan, inplace=True) # for now ill clean a bit more later

        # Interest rate risk interaction 
        X["rate_x_loan"] = X["loan_int_rate"] * X["loan_amnt"]
        X["rate_x_loan"].replace([np.inf, -np.inf], np.nan, inplace=True) # for now ill clean a bit more later

        # Employee stability
        X["emp_stability"] = X["person_emp_length"].apply(
            lambda x: "low" if x < 2 else "mid" if x < 5 else "high"
        )

        # employee length to age ratio 
        X["emp_length_ratio"] = X["person_emp_length"] / X["person_age"]

        X["cb_person_default_on_file"] = X["cb_person_default_on_file"].map({
            "Y":1, "N":0
        })
        X["cb_person_default_on_file"].replace([np.inf, -np.inf], np.nan, inplace=True) # for now ill clean a bit more later

        return X