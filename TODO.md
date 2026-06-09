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
- [ ] **Data Integrity Constraints**: Implement SQL-level check constraints (e.g., age >= 18, income >= 0, loan amount > 0) in the migration files to complement backend validations.
- [ ] **Environment Documentation**: Create a `.env.example` in the root directory to standardize local setup for new contributors.
- [ ] **Unit Testing**: Add API tests covering CRUD operations and edge-case validations (using `pytest`).

## Machine Learning Pipeline Scalability
- [x] **Dynamic Database Config**: Refactor `ml/train_model.py` to load database URL from environment configurations/`.env` instead of hardcoding Oracle credentials.
- [x] **Scalable Data Loading**: Support pagination or chunking (`chunksize`) for SQL queries in `train_model.py` to prevent memory exhaustion on large datasets.
- [ ] **Automated Plot Saving**: Save model training diagnostic plots (Confusion Matrix, ROC, Precision-Recall) directly as files rather than calling blocking `plt.show()` commands.
- [ ] **Conditional Cross-Validation**: Add an option/flag to bypass cross-validation evaluation in `train_model.py` to optimize training speed during automated pipeline runs.

## Future Considerations
- [ ] **Relational Expansion**: Split the flat `LoanApplication` table into `Applicants` and `Loans` if repeat applications are supported.
- [ ] **Advanced SQL Architecture**: Transition to a dimensional model (Star Schema) in the database for advanced analytical reporting.

