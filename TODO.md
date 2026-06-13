# Project Roadmap & TODO

## Completed Tasks
- [x] **Structural Refactoring**: Moved logic into modular directories (`models/`, `routes/`, `validators/`, `services/`).
- [x] **Application Factory**: Implemented `create_app()` in `backend/app/__init__.py`.
- [x] **Extension Management**: Centralized SQLAlchemy initialization in `extensions.py` to prevent circular imports.
- [x] **Blueprint Integration**: Refactored API routes into a modular Blueprint system.
- [x] **Input Validation**: Extracted complex validation logic into a dedicated `application_validator.py`.
- [x] **Configuration Management**: Consolidated environment paths and variables in `backend/app/config/`.
- [x] **Standardize Domain Naming**: Rename the `Financials` model and class to `LoanApplications` (Aligns Backend with Frontend terminology).
- [x] **Identity Refactoring**: Rename `person_id` to `application_id` to reflect that records are application snapshots, not unique user profiles.
- [x] **Legacy SQL Cleanup**: Remove "garbage" Oracle and PostgreSQL scripts from the `db/` folder to eliminate dialect confusion.
- [x] **Migration Strategy**: Initialize `Flask-Migrate` (Alembic) to handle schema changes instead of relying on `db.create_all()`.
- [x] **PostgreSQL Synchronization**: Ensure Render PostgreSQL compatibility, use appropriate URL schemes, and configure requirements.

## Git & Repository Hygiene
- [x] **Untrack Local SQLite DB**: Remove `app.db` from Git tracking (`git rm --cached`) and add `*.db` to `.gitignore` to avoid versioning binary database files.
- [x] **Cleanup Legacy Assets**: Remove unused `shared/config.py` and old references to `app.db` locations.

## Database Views & Analytics Layer
- [x] **Deploy Database Views**: Create an Alembic migration script containing SQL schema definitions for key analytical views:
- [x] **Expose Analytics Endpoints**: Register an `/analytics` Blueprint in Flask with routes to query these views and return JSON data:
  - eg. `GET /analytics/loss_by_grade`

- [x] **Update SQL Documentation**: Document the structure of these views under a new `db/views/` folder and sync `db/schema.sql` for reference.

## Dataset Import Pipeline
- [x] **Create Bulk Ingestion Script**: Develop `scripts/import_credit_dataset.py` to parse, validate, and bulk-load `data/credit_risk_dataset.csv` into the `loan_applications` database table using SQLAlchemy's optimized bulk APIs.

## Security & Reliability
- [x] **API Security**: Restrict or remove the `/debug-db` route for production environments.
- [x] **Data Integrity Constraints**: Implement SQL-level check constraints (e.g., age >= 18, income >= 0, loan amount > 0) in the migration files to complement backend validations.
- [ ] **Environment Documentation**: Create a `.env.example` in the root directory to standardize local setup for new contributors.
- [x] **Unit Testing**: Add API tests covering CRUD operations and edge-case validations (using `pytest`).

## Machine Learning: Pipeline, Scalability & Integration
- [x] **Dynamic Database Config**: Refactor `ml/train_model.py` to load database URL from environment configurations/`.env` instead of hardcoding Oracle credentials.
- [x] **Scalable Data Loading**: Support pagination or chunking (`chunksize`) for SQL queries in `train_model.py` to prevent memory exhaustion on large datasets.
- [x] **Automated Plot Saving**: Save model training diagnostic plots (Confusion Matrix, ROC, Precision-Recall) directly as files rather than calling blocking `plt.show()` commands.
- [x] **Conditional Cross-Validation**: Add an option/flag to bypass cross-validation evaluation in `train_model.py` to optimize training speed during automated pipeline runs.
- [ ] **Fix `DATABASE_URL` Import in `ml/train_model.py`**: Correct the import statement to use the correct database URL variable from [paths.py](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/backend/app/config/paths.py).
- [ ] **Fix CLI Argument Parsing Order**: Move `argparse` execution to the top of [train_model.py](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/ml/train_model.py) (or inside a main function) so that arguments like `--help` or `--run-cv` are evaluated before training begins.
- [ ] **Filter out Unlabeled Applications in Training**: Modify the SQL query in [train_model.py](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/ml/train_model.py) to filter `WHERE loan_status IS NOT NULL` to prevent scikit-learn from crashing on `NaN` targets.
- [ ] **Optimize Single-Row Inference Overhead**: Investigate options to reduce pandas and sklearn pipeline instantiation overhead for single-record predictions in [prediction_service.py](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/backend/app/services/prediction_service.py).
- [ ] **Vectorize Bulk Prediction Metrics**: Replace slow `df.apply(..., axis=1)` loops with vectorized NumPy/Pandas operations in `run_bulk_prediction`.
- [ ] **Fix Expected Loss Calculation Logic**: Correct the definition of Loss Given Default (LGD) in [prediction_service.py](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/backend/app/services/prediction_service.py), which is currently arbitrarily bound to the classification `threshold`.
- [ ] **Fix API Type Validation Mismatch**: Update `FIELD_TYPES` in [application_validator.py](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/backend/app/validators/application_validator.py) to allow float representation for income/loan amount and handle float/int conversion gracefully.
- [ ] **Allow Zero Employment Length**: Fix `FIELD_VALIDATION` in [application_validator.py](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/backend/app/validators/application_validator.py) to allow `person_emp_length = 0` (unemployed/under 1 year) to match the database check constraints.
- [ ] **Validate `cb_person_default_on_file` Values**: Restrict input validation to `["Y", "N"]` to prevent silent `NaN` mapping and imputation in the ML preprocessing pipeline.
- [ ] **Fix SQL Bugs in Scratch Views File**: Fix syntax errors and incorrect column references (`loan_amount`, `loss`) in [db/views](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/db/views) to align it with the correct migration definitions.

## Bulk Operations & CRUD Extensions
- [ ] **Bulk Deletes / Delete All**: Create backend and frontend support for bulk operations:
  - Backend: Implement a secure Flask route (e.g. `DELETE /applications`) to clear all rows or a batch selection.
  - Frontend: Add selection checkboxes, a "Delete All" button, and confirmation modal dialogs.

## Frontend & State Management
- [x] **Standardize Domain Naming for Frontend Pages**:
  - Rename `CreditPage` (which does not represent a domain concept) to `ApplicationsPage` to keep nomenclature aligned with `Applications` and `Analytics`.
- [x] **Refactor `useApplications` Hook (Pattern B Integration)**:
  - Update [useApplications.jsx](file:///D:/2026_internship/whtvr_i_need/credit-risk-app/frontend/src/hooks/useApplications.jsx) to accept a `filters` object as a parameter.
  - Import `useQuery` from `@tanstack/react-query` to execute and cache search requests reactively.
  - Remove all legacy, unreachable dead code (the old manual `loadApplications` and individual state values) to keep the hook thin and clean.
- [x] **Port Client State and Mutations to ApplicationsPage**:
  - Manage the unified `filters` state and input debouncing at the component/page layer.
  - Set up `useMutation` handlers at the page level for adding, updating, and deleting applications to automate query cache invalidation.
- [ ] **Write Unit Tests for `useApplications` Hook**: Add tests (using `@testing-library/react` or `@testing-library/react-hooks`) to verify reactivity, query caching, filtering logic, and error scenarios.
- [ ] **Write Component/Integration Tests for `ApplicationsPage`**: Create test coverage for the applications listing page to ensure filter state updates, debounced inputs, and pagination render and behave correctly.

## Future Considerations
- [ ] **Relational Expansion**: Split the flat `LoanApplication` table into `Applicants` and `Loans` if repeat applications are supported.
- [ ] **Advanced SQL Architecture**: Transition to a dimensional model (Star Schema) in the database for advanced analytical reporting.
- [ ] **Real-Time Event Ingestion (Apache Kafka)**: User submissions immediately write to a Kafka topic (`application-submissions`). This decouples the client from database operations, preventing frontend lockups during traffic spikes.
- [ ] **Stream Processing (Apache Spark Structured Streaming)**: PySpark consumes the submission stream in real-time, executing feature engineering and ML model predictions in vectorized batches (e.g. predicting thousands of rows in a single pass) instead of synchronous single-row loops.
- [ ] **Idempotent Document Storage (MongoDB)**: Audit logs and predictions are written to MongoDB. By defining a compound unique index on `{applicant_id, application_date}`, the database uses upsert writes (with `$addToSet`) to handle network retries or message re-deliveries without creating duplicate records.
- [ ] **Push-Based Visualizations (WebSockets)**: Instead of the frontend polling endpoints for dashboard data, changes in the analytical aggregates are pushed directly to the React UI in real-time using WebSockets, creating a live-updating credit risk dashboard.
