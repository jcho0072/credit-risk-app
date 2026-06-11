"""add_sql_check_constraints

Revision ID: 383e7f92d3e9
Revises: e672ee6aecdf
Create Date: 2026-06-11 14:49:47.079907

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '383e7f92d3e9'
down_revision = 'e672ee6aecdf'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('LoanApplications', schema=None) as batch_op:
        batch_op.create_check_constraint("check_person_age_min", "person_age >= 18")
        batch_op.create_check_constraint("check_person_income_nonnegative", "person_income >= 0")
        batch_op.create_check_constraint("check_person_emp_length_nonnegative", "person_emp_length >= 0")
        batch_op.create_check_constraint("check_loan_amnt_range", "loan_amnt >= 0 AND loan_amnt <= 100000")
        batch_op.create_check_constraint("check_loan_int_rate_range", "loan_int_rate >= 0 AND loan_int_rate <= 100")
        batch_op.create_check_constraint("check_loan_status_binary", "loan_status IN (0, 1)")
        batch_op.create_check_constraint("check_loan_percent_income_range", "loan_percent_income >= 0 AND loan_percent_income <= 1")
        batch_op.create_check_constraint("check_cb_person_cred_hist_length_nonnegative", "cb_person_cred_hist_length >= 0")


def downgrade():
    with op.batch_alter_table('LoanApplications', schema=None) as batch_op:
        batch_op.drop_constraint("check_person_age_min", type_="check")
        batch_op.drop_constraint("check_person_income_nonnegative", type_="check")
        batch_op.drop_constraint("check_person_emp_length_nonnegative", type_="check")
        batch_op.drop_constraint("check_loan_amnt_range", type_="check")
        batch_op.drop_constraint("check_loan_int_rate_range", type_="check")
        batch_op.drop_constraint("check_loan_status_binary", type_="check")
        batch_op.drop_constraint("check_loan_percent_income_range", type_="check")
        batch_op.drop_constraint("check_cb_person_cred_hist_length_nonnegative", type_="check")

