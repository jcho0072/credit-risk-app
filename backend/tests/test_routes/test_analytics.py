import pytest
from backend.app.models import LoanApplications

@pytest.fixture
def sample_payload():
    """Returns a valid application payload for records."""
    return {
        "pred_probability": 0.6,
        "pred_status": 1,
        "decision": "Reject",
        "risk": "High" 
    }

@pytest.fixture
def seed_data(db):
    """Seed the database with sample applications for analytics aggregation."""
    app1 = LoanApplications(
        person_name="Alice", person_age=25, person_income=50000.0,
        person_home_ownership="RENT", person_emp_length=2, loan_intent="EDUCATION",
        loan_grade="A", loan_amnt=10000.0, loan_int_rate=5.0, loan_status=0,
        loan_percent_income=0.2, cb_person_default_on_file="N", cb_person_cred_hist_length=3,
        pred_probability=0.1, pred_status="0", expected_loss=100.0, threshold=0.4,
        decision="Approve", risk="Low Risk"
    )
    app2 = LoanApplications(
        person_name="Bob", person_age=30, person_income=60000.0,
        person_home_ownership="MORTGAGE", person_emp_length=4, loan_intent="EDUCATION",
        loan_grade="B", loan_amnt=20000.0, loan_int_rate=8.0, loan_status=1,
        loan_percent_income=0.33, cb_person_default_on_file="Y", cb_person_cred_hist_length=5,
        pred_probability=0.5, pred_status="1", expected_loss=400.0, threshold=0.4,
        decision="Reject", risk="High Risk"
    )
    app3 = LoanApplications(
        person_name="Charlie", person_age=35, person_income=70000.0,
        person_home_ownership="OWN", person_emp_length=6, loan_intent="MEDICAL",
        loan_grade="A", loan_amnt=30000.0, loan_int_rate=6.0, loan_status=0,
        loan_percent_income=0.43, cb_person_default_on_file="N", cb_person_cred_hist_length=7,
        pred_probability=0.2, pred_status="0", expected_loss=300.0, threshold=0.4,
        decision="Approve", risk="Low Risk"
    )
    db.session.add_all([app1, app2, app3])
    db.session.commit()

def test_loss_by_grade(client, seed_data):
    """Ensure GET /analytics/loss-by-grade aggregates correctly."""
    response = client.get("/analytics/loss-by-grade")
    assert response.status_code == 200
    
    json_data = response.get_json()
    data = json_data["data"]
    
    # We expect Grade A and Grade B
    assert len(data) == 2
    
    # Find Grade A data
    grade_a = next(item for item in data if item["loan_grade"] == "A")
    assert grade_a["total_applications"] == 2
    assert float(grade_a["average_loss_per_grade"]) == 200.0 # (100 + 300) / 2
    
    # Find Grade B data
    grade_b = next(item for item in data if item["loan_grade"] == "B")
    assert grade_b["total_applications"] == 1
    assert float(grade_b["average_loss_per_grade"]) == 400.0

def test_default_rate_by_intent(client, seed_data):
    """Ensure GET /analytics/default-rate-by-intent aggregates correctly."""
    response = client.get("/analytics/default-rate-by-intent")
    assert response.status_code == 200
    
    json_data = response.get_json()
    data = json_data["data"]
    
    # We expect EDUCATION and MEDICAL intents
    assert len(data) == 2
    
    # Find EDUCATION intent data
    edu = next(item for item in data if item["loan_intent"] == "EDUCATION")
    assert edu["total_applications"] == 2
    assert float(edu["average_loan_amount"]) == 15000.0 # (10000 + 20000) / 2
    assert float(edu["average_predicted_probability"]) == 0.3 # (0.1 + 0.5) / 2
    
    # Find MEDICAL intent data
    med = next(item for item in data if item["loan_intent"] == "MEDICAL")
    assert med["total_applications"] == 1
    assert float(med["average_loan_amount"]) == 30000.0
    assert float(med["average_predicted_probability"]) == 0.2

def test_loan_amount_by_grade(client, seed_data):
    """Ensure GET /analytics/loan-amount-by-grade aggregates correctly."""
    response = client.get("/analytics/loan-amount-by-grade")
    assert response.status_code == 200
    
    json_data = response.get_json()
    data = json_data["data"]
    
    # We expect Grade A and Grade B
    assert len(data) == 2
    
    # Find Grade A data
    grade_a = next(item for item in data if item["loan_grade"] == "A")
    assert grade_a["total_applications"] == 2
    assert float(grade_a["average_loan_amount"]) == 20000.0 # (10000 + 30000) / 2
    
    # Find Grade B data
    grade_b = next(item for item in data if item["loan_grade"] == "B")
    assert grade_b["total_applications"] == 1
    assert float(grade_b["average_loan_amount"]) == 20000.0
