CREATE TABLE Financials(
	person_id SERIAL PRIMARY KEY,
	person_name VARCHAR(30),
	person_age INTEGER,
	person_income NUMERIC(9,2),
	person_home_ownership VARCHAR(20),
	person_emp_length INTEGER,
	
	loan_intent VARCHAR(20),
	loan_grade VARCHAR(5),
	loan_amnt NUMERIC(9,2),
	loan_int_rate NUMERIC(5,2),
	loan_status INTEGER,
	loan_percent_income NUMERIC(5,2),
	
	cb_person_default_on_file VARCHAR(5),
	cb_person_cred_hist_length INTEGER,

	pred_probability NUMERIC(5,2),
	pred_status VARCHAR(10),
	expected_loss NUMERIC(9,2),
	threshold NUMERIC(9,2),
	decision VARCHAR(20),
	risk VARCHAR(20)
);

-- create table ApplicantDIM as 
-- select 
-- 	person_id,
-- 	person_age,
-- 	person_home_ownership,
-- 	person_emp_length
-- from Financials;



-- create table RiskDIM (
-- 	default_dim_id SERIAL PRIMARY KEY,
-- 	current_loan_status INTEGER,
-- 	has_ever_defaulted VARCHAR(2),
-- 	credit_history INTEGER
-- );

-- insert into RiskDIM (
-- 	current_loan_status,
-- 	has_ever_defaulted,
-- 	credit_history
-- )
-- select distinct
-- 	loan_status,
-- 	cb_person_default_on_file,
--     cb_person_cred_hist_length
-- from Financials;



-- create table LoanDIM(
-- 	loan_dim_id SERIAL PRIMARY KEY,
-- 	loan_grade VARCHAR(5),
-- 	loan_intent VARCHAR(20)
-- );

-- INSERT INTO LoanDIM (
-- 	loan_grade,
-- 	loan_intent
-- )
-- SELECT DISTINCT 
-- 	loan_grade,
-- 	loan_intent
-- from Financials;



-- create table MetricsDIM(
-- 	metrics_id SERIAL PRIMARY KEY,
-- 	predicted_default_probability NUMERIC(2,2), 
-- 	predicted_loan_status VARCHAR(20),
-- 	expected_loss NUMERIC(8,2),
-- 	decision VARCHAR(20),
-- 	risk VARCHAR(20)
-- );

-- INSERT INTO MetricsDIM(
--     predicted_default_probability,
--     predicted_loan_status,
-- 	expected_loss, 
-- 	decision,
-- 	risk  
-- )
-- select distinct
--     pred_probability,
-- 	pred_status,
-- 	expected_loss,
-- 	decision,
-- 	risk
--   from Financials;



-- create table LoanFact as
-- select distinct
-- 	m.metrics_id,
-- 	a.person_id,
-- 	r.default_dim_id,
-- 	l.loan_dim_id,
	
-- 	f.person_income,
-- 	f.loan_amnt,
-- 	f.loan_int_rate,
-- 	f.loan_percent_income
-- from Financials f
-- JOIN ApplicantDIM a
-- 	ON a.person_id = f.person_id

-- JOIN RiskDIM r
-- 	ON r.current_loan_status = f.loan_status
-- 	AND r.has_ever_defaulted = f.cb_person_default_on_file
-- 	AND r.credit_history = f.cb_person_cred_hist_length

-- JOIN LoanDIM l
-- 	ON l.loan_grade = f.loan_grade
-- 	AND l.loan_intent = f.loan_intent

-- -- check this later
-- JOIN MetricsDIM m
-- 	ON m.predicted_default_probability = f.pred_probability
--     AND m.predicted_loan_status = f.pred_status
-- 	AND m.expected_loss = f.expected_loss
-- 	AND m.decision = f.decision
-- 	AND m.risk = f.risk  


-- select * from MetricsDIM;