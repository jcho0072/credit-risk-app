import pytest
from backend.app.models.loan_applications import LoanApplications

@pytest.fixture
def sample_payload():
    """Returns a valid application payload for creating records."""
    return {
        "person_name": "Jane Doe",
        "person_age": 28,
        "person_income": 60000,
        "person_home_ownership": "MORTGAGE",
        "person_emp_length": 3,
        "loan_intent": "PERSONAL",
        "loan_grade": "B",
        "loan_amnt": 15000,
        "loan_int_rate": 9.5,
        "loan_status": 0,
        "loan_percent_income": 0.25,
        "cb_person_default_on_file": "N",
        "cb_person_cred_hist_length": 5
    }


def test_get_applications_empty(client):
    """Ensure GET /applications returns empty list and pagination metadata on empty DB."""
    response = client.get("/applications")
    assert response.status_code == 200

    json_data = response.get_json()
    assert json_data["data"] == []
    assert json_data["pagination"]["totalCount"] == 0


def test_create_application_success(client, sample_payload):
    """Ensure POST /applications successfully creates a record and runs model predictions."""
    response = client.post("/applications", json=sample_payload)
    assert response.status_code == 201

    json_data = response.get_json()
    assert json_data["data"]["person_name"] == sample_payload["person_name"]
    # Ensure ML prediction results are generated and populated
    assert "pred_probability" in json_data["data"]
    assert "decision" in json_data["data"]

    # Verify it exists in the test database
    assert LoanApplications.query.count() == 1


def test_create_application_invalid(client):
    """Ensure POST /applications fails validation on bad payload."""
    payload = {"person_name": "Shorty"}  # Missing almost all fields
    response = client.post("/applications", json=payload)
    assert response.status_code == 400

    json_data = response.get_json()
    assert json_data["error"]["code"] == "MISSING_FIELDS"


def test_update_application_success(client, db):
    """Ensure PUT /applications/<id> successfully updates an existing record."""
    # 1. Seed a record in the database
    app_record = LoanApplications(
        person_name="Jane Doe", person_age=30, person_income=40000,
        person_home_ownership="RENT", person_emp_length=2, loan_intent="MEDICAL",
        loan_grade="C", loan_amnt=5000, loan_int_rate=12.0, loan_status=0,
        loan_percent_income=0.12, cb_person_default_on_file="N", cb_person_cred_hist_length=2,
        pred_probability=0.15, pred_status=0, expected_loss=750, threshold=0.45,
        decision="Approve", risk="Low Risk"
    )
    db.session.add(app_record)
    db.session.commit()

    # 2. Update via PUT request
    update_payload = {
        "person_name": "John Doe",
        "person_age": 31,
        "person_income": 45000,
        "person_home_ownership": "RENT",
        "person_emp_length": 3,
        "loan_intent": "MEDICAL",
        "loan_grade": "C",
        "loan_amnt": 6000,
        "loan_int_rate": 11.5,
        "loan_status": 0,
        "loan_percent_income": 0.13,
        "cb_person_default_on_file": "N",
        "cb_person_cred_hist_length": 3
    }
    response = client.put(f"/applications/{app_record.application_id}", json=update_payload)
    assert response.status_code == 200


    # 3. Assert changes took place in the HTTP response
    json_data = response.get_json()
    assert json_data["data"]["person_name"] == "John Doe"
    assert json_data["data"]["person_age"] == 31
    assert "decision" in json_data["data"]  # Proves ML prediction ran again


    # 4. Proves the data was actually saved to the database
    db_record = LoanApplications.query.get(app_record.application_id)
    assert db_record.person_name == "John Doe"
    assert db_record.person_age == 31


def test_delete_application_success(client, db):
    """Ensure DELETE /applications/<id> removes the record."""
    app_record = LoanApplications(
        person_name="Delete Me", person_age=30, person_income=40000,
        person_home_ownership="RENT", person_emp_length=2, loan_intent="MEDICAL",
        loan_grade="C", loan_amnt=5000, loan_int_rate=12.0, loan_status=0,
        loan_percent_income=0.12, cb_person_default_on_file="N", cb_person_cred_hist_length=2,
        pred_probability=0.15, pred_status=0, expected_loss=750, threshold=0.45,
        decision="Approve", risk="Low Risk"
    )
    db.session.add(app_record)
    db.session.commit()

    response = client.delete(f"/applications/{app_record.application_id}")
    assert response.status_code == 200

    # Verify it is gone from the database
    assert LoanApplications.query.get(app_record.application_id) is None


def test_delete_application_not_found(client):
    """Ensure deleting a non-existent ID returns 404."""
    response = client.delete("/applications/999")
    assert response.status_code == 404