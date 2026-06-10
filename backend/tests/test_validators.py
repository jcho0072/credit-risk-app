import pytest
from backend.app.validators.application_validator import validate_application

@pytest.fixture
def valid_payload():
    """Returns a completely valid application payload."""
    return {
        "person_name": "John Doe",
        "person_age": 30,
        "person_income": 50000,
        "person_home_ownership": "RENT",
        "person_emp_length": 5,
        "loan_intent": "EDUCATION",
        "loan_grade": "A",
        "loan_amnt": 10000,
        "loan_int_rate": 7.5,
        "loan_status": 0,
        "loan_percent_income": 0.2,
        "cb_person_default_on_file": "N",
        "cb_person_cred_hist_length": 3
    }

def test_validate_valid_application(valid_payload):
    """Ensure a correct payload passes validation with no errors."""
    result = validate_application(valid_payload)
    assert result is None

def test_validate_none_payload():
    """Ensure None payload returns an invalid JSON error."""
    result, status_code = validate_application(None)
    assert status_code == 400
    assert result["error"]["code"] == "INVALID_JSON"

def test_validate_missing_fields(valid_payload):
    """Ensure missing required fields are caught and listed."""
    del valid_payload["person_name"]
    del valid_payload["person_age"]
    result, status_code = validate_application(valid_payload)

    assert status_code == 400
    assert result["error"]["code"] == "MISSING_FIELDS"
    assert "person_name" in result["fields"]
    assert "person_age" in result["fields"]

def test_validate_invalid_types(valid_payload):
    """Ensure incorrect data types are caught."""
    valid_payload["person_age"] = "thirty"  # testing string 
    result, status_code = validate_application(valid_payload)

    assert status_code == 400
    assert result["error"]["code"] == "INVALID_TYPE"
    assert result["error"]["field"] == "person_age"

@pytest.mark.parametrize("field,invalid_value", [
    ("person_age", 17),                   # Under 18
    ("person_income", 0),                 # Income <= 0
    ("person_emp_length", 0),             # Employment length <= 0
    ("loan_amnt", -10),                   # Loan amount < 0
    ("loan_amnt", 150000),                # Loan amount > 100000
    ("loan_int_rate", 105.0),             # Interest rate > 100%
    ("loan_status", 3),                   # Status not 0 or 1
    ("loan_percent_income", 1.5),         # Percent income > 1
    ("cb_person_cred_hist_length", -1)    # Credit history length < 0
])
def test_validate_invalid_ranges(valid_payload, field, invalid_value):
    """Ensure boundary rules and values are correctly validated."""
    valid_payload[field] = invalid_value
    result, status_code = validate_application(valid_payload)

    assert status_code == 400
    assert result["error"]["code"] == "INVALID_VALUE"
    assert result["error"]["field"] == field