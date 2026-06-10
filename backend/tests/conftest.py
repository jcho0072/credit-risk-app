import pytest
from sqlalchemy import text
from backend.app import create_app
from backend.app.extensions import db as _db

@pytest.fixture
def app():
    """Create and configure a Flask application instance for testing."""
    # Pass 'testing' config name to use settings.TestingConfig (in-memory SQLite)
    app = create_app("testing")
    
    # Establish application context
    with app.app_context():
        yield app

@pytest.fixture
def db(app):
    """Set up and tear down a clean database for each test case."""
    # Create all tables in the in-memory SQLite database
    _db.create_all()

     # 2. Deploy analytics views into the test SQLite database
    _db.session.execute(text("""
        CREATE VIEW v_default_rate_by_intent AS
        SELECT
            loan_intent,
            COUNT(*) AS total_applications,
            ROUND(CAST(AVG(loan_amnt) AS NUMERIC), 2) AS average_loan_amount,
            ROUND(CAST(AVG(pred_probability) AS NUMERIC), 2) AS average_predicted_probability
        FROM loan_applications
        GROUP BY loan_intent;
    """))
    _db.session.execute(text("""
        CREATE VIEW v_loss_by_grade AS
        SELECT
            loan_grade,
            COUNT(*) AS total_applications,
            ROUND(CAST(AVG(expected_loss) AS NUMERIC), 2) AS average_loss_per_grade
        FROM loan_applications
        GROUP BY loan_grade;
    """))
    _db.session.execute(text("""
        CREATE VIEW v_loan_amount_by_grade AS
        SELECT
            loan_grade,
            COUNT(*) AS total_applications,
            ROUND(CAST(AVG(loan_amnt) AS NUMERIC), 2) AS average_loan_amount
        FROM loan_applications
        GROUP BY loan_grade;
    """))
    _db.session.commit()
    
    yield _db
    
    # Drop all tables after the test runs to leave a clean state
    _db.session.remove()
    _db.drop_all()

@pytest.fixture
def client(app, db):
    """A test client for simulating API requests."""
    return app.test_client()