import pytest
from sqlalchemy.exc import IntegrityError
from backend.app.models import LoanApplications

def test_age_check_constraint(db):
    """Ensure age check constraint prevents underage applications."""
    bad_record = LoanApplications(
        person_name="Underage Test",
        person_age=12,  # Invalid (< 18)
        person_income=50000.0,
        person_home_ownership="RENT",
        person_emp_length=2,
        loan_intent="PERSONAL",
        loan_grade="A",
        loan_amnt=10000.0,
        loan_int_rate=5.0,
        loan_status=0,
        loan_percent_income=0.2,
        cb_person_default_on_file="N",
        cb_person_cred_hist_length=1
    )
    db.session.add(bad_record)

    # Assert that committing this record throws an IntegrityError
    with pytest.raises(IntegrityError):
        db.session.commit()

def test_loan_amount_check_constraint(db):
    """Ensure loan amount constraint prevents exceeding 100k."""
    bad_record = LoanApplications(
        person_name="Huge Loan Test",
        person_age=30,
        person_income=50000.0,
        person_home_ownership="RENT",
        person_emp_length=2,
        loan_intent="PERSONAL",
        loan_grade="A",
        loan_amnt=150000.0,  # Invalid (> 100k)
        loan_int_rate=5.0,
        loan_status=0,
        loan_percent_income=0.2,
        cb_person_default_on_file="N",
        cb_person_cred_hist_length=1
    )
    db.session.add(bad_record)

    with pytest.raises(IntegrityError):
        db.session.commit()