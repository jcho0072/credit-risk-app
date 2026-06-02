# Database Management & Migration Plan

This directory contains the SQL assets for the Credit Risk Assessment System.

## Current Schema Issues (db/schema.sql - Updated)
1. **Commented State**: The entire file is currently commented out. While it serves as a blueprint, it cannot be executed directly to set up the environment.
2. **Naming Inconsistency**: The database still uses `Financials` and `person_id`. The project roadmap (`TODO.md`) mandates a transition to `LoanApplication` and `application_id` to better represent the "snapshot" nature of the data.
3. **Circular Metrics Logic**: The `MetricsDIM` join in the `LoanFact` creation relies on joining all non-key metrics (probability, decision, risk, etc.) back to the source table. This is fragile and can lead to performance issues or data mismatch if any value is updated in one place but not the other.
4. **Data Integrity**: There are still no SQL-level `CHECK` constraints (e.g., ensuring age > 18 or income >= 0) or Foreign Key relationships enforced in the dimensional model.
5. **Data Type precision**: Some numeric fields like `predicted_default_probability` use `NUMERIC(2,2)`, which might be too restrictive if precision beyond two decimal places is required.

## Migration Plan (`migrations.sql`)

The following steps will be implemented in `migrations.sql` to standardize the database:

### Step 1: Core Domain Refactoring
- **Action**: Rename `Financials` table to `loan_applications`.
- **Action**: Rename `person_id` column to `application_id`.
- **Goal**: Align the database with the updated domain terminology in the backend and frontend.

### Step 2: Data Integrity & Constraints
- **Action**: Add `CHECK` constraints for:
    - `person_age` (>= 18)
    - `person_income` (>= 0)
    - `loan_amnt` (> 0)
- **Action**: Add `NOT NULL` constraints to mandatory fields.
- **Goal**: Enforce business rules at the database level.

### Step 3: Dimensional Model Initialization
- **Action**: Create the Star Schema:
    - `ApplicantDIM`: Demographic data.
    - `LoanDIM`: Intent and Grade data.
    - `RiskDIM`: Historical default and credit history.
    - `MetricsDIM`: Prediction outcomes (Probability, Decision, Risk).
    - `LoanFact`: Central fact table linking all dimensions.
- **Action**: Implement explicit Foreign Keys between `LoanFact` and the Dimensions.
- **Goal**: Enable efficient business intelligence and robust reporting.

### Step 4: Analytical Layer
- **Action**: Create `views.sql` to encapsulate complex reporting logic (e.g., `v_loan_grade_performance`).
- **Action**: Create `seeds.sql` for initial reference data and test cases.

## Missing Files (Recommended)
Based on standard database architecture, we should also include:
1. **`seeds.sql`**: Initial data to populate the warehouse and testing environments.
2. **`views.sql`**: Pre-defined analytical views (e.g., `loan_grade_summary`) to simplify reporting queries.
