from backend.app.extensions import db

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