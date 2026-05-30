# TODO

## Backend Refactoring

- [ ] Rename the `Financials` model to `LoanApplication` to clarify that each row represents an application snapshot.
- [ ] Rename `person_id` to `application_id`.
- [ ] Move SQLAlchemy models into `backend/app/models/`.
- [ ] Move API endpoints into `backend/app/routes/`.
- [ ] Extract request validation into `backend/app/validators/`.
- [ ] Introduce an application factory and `extensions.py` for Flask extension initialization.
- [ ] Consolidate backend configuration under `backend/app/config/`.
- [ ] Remove the unused `shared/config.py` file.
- [ ] Choose one SQLite development database location and ignore generated database files.
- [ ] Add a root `.env.example` file with placeholder configuration values.
- [ ] Restrict or remove the `/debug-db` route outside development.
- [ ] Add API tests for create, read, update, delete, and validation behavior.

## Future Scaling Considerations

- [ ] Introduce tracked database migrations before changing a deployed schema.
- [ ] Record the model version and threshold used for each prediction.
- [ ] Separate applicant identity from loan-application snapshots if repeat applications become a supported feature.
- [ ] Move from SQLite to a managed relational database if concurrent writes or multiple backend instances are required.
