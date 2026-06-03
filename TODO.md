# Project Roadmap & TODO

## Completed Tasks
- [x] **Structural Refactoring**: Moved logic into modular directories (`models/`, `routes/`, `validators/`, `services/`).
- [x] **Application Factory**: Implemented `create_app()` in `backend/app/__init__.py`.
- [x] **Extension Management**: Centralized SQLAlchemy initialization in `extensions.py` to prevent circular imports.
- [x] **Blueprint Integration**: Refactored API routes into a modular Blueprint system.
- [x] **Input Validation**: Extracted complex validation logic into a dedicated `application_validator.py`.
- [x] **Configuration Management**: Consolidated environment paths and variables in `backend/app/config/`.

##  Backend & Domain Refactoring
- [x] **Standardize Domain Naming**: Rename the `Financials` model and class to `LoanApplications` (Aligns Backend with Frontend terminology).
- [x] **Identity Refactoring**: Rename `person_id` to `application_id` to reflect that records are application snapshots, not unique user profiles.
- [ ] **Cleanup Legacy Assets**: Remove unused `shared/config.py` and redundant `app.db` locations.
- [ ] **API Security**: Restrict or remove the `/debug-db` route for production environments.
- [ ] **Environment Documentation**: Create a `.env.example` in the root directory to standardize local setup for new contributors.

##  Database & Infrastructure 
- [x] **Legacy SQL Cleanup**: Remove "garbage" Oracle and PostgreSQL scripts from the `db/` folder to eliminate dialect confusion.
- [x] **Migration Strategy**: Initialize `Flask-Migrate` (Alembic) to handle schema changes instead of relying on `db.create_all()`.
- [x] **PostgreSQL Synchronization**: 
    - [x] Ensure `DATABASE_URL` uses the `postgresql://` driver prefix.
    - [x] Verify Render environment variables are correctly mapped to the Web Service.
    - [x] Add `psycopg2-binary` to `requirements.txt` for production compatibility.
- [ ] **Data Integrity**: Implement SQL-level constraints (e.g., `CHECK` constraints for age and income) to augment Python validation.

##  Quality Assurance & Observability
- [ ] **Unit Testing**: Add API tests covering CRUD operations and edge-case validations (using `pytest`).

##  Future Considerations
- [ ] **Relational Expansion**: Split the flat `LoanApplication` table into `Applicants` and `Loans` if repeat applications are supported.
- [ ] **Advanced SQL Architecture**: Transition to a dimensional model (Star Schema) in the database for advanced analytical reporting.
