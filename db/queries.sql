-- CREATE TABLE temp(
-- 	person_id SERIAL PRIMARY KEY,
-- 	person_age INTEGER,
-- 	person_income NUMERIC(9,2),
-- 	person_home_ownership VARCHAR(20),
-- 	person_emp_length NUMERIC,
-- 	loan_intent VARCHAR(20),
-- 	loan_grade VARCHAR(5),
-- 	loan_amnt NUMERIC(9,2),
-- 	loan_int_rate NUMERIC(5,2),
-- 	loan_status VARCHAR(5),
-- 	loan_percent_income NUMERIC(5,2),
-- 	cb_person_default_on_file VARCHAR(2),
-- 	cb_person_cred_hist_length INTEGER
-- );

CREATE TABLE Financials(
	person_id SERIAL PRIMARY KEY,
	person_name VARCHAR(10),
	person_age INTEGER,
	person_income NUMERIC(9,2),
	person_home_ownership VARCHAR(20),
	person_emp_length NUMERIC,
	
	loan_intent VARCHAR(20),
	loan_grade VARCHAR(5),
	loan_amnt NUMERIC(9,2),
	loan_int_rate NUMERIC(5,2),
	loan_status VARCHAR(5),
	loan_percent_income NUMERIC(5,2),
	
	cb_person_default_on_file VARCHAR(2),
	cb_person_cred_hist_length INTEGER,

	pred_probability NUMERIC(5,2),
	pred_status INTEGER,
	expected_loss NUMERIC(9,2),
	threshold NUMERIC(9,2),
	decision VARCHAR(20),
	risk VARCHAR(20)
);






-- SELECT 
-- 	*
-- 	FROM(
-- 		SELECT
-- 			CASE
-- 				WHEN loan_int_rate < 10 THEN 'Low'
-- 				WHEN loan_int_rate BETWEEN 10 AND 20 THEN 'Medium'
-- 				ELSE 'High'
-- 			END AS interest_category,
-- 			loan_grade,
-- 			loan_intent,
-- 			AVG(loan_amount) as avg_loan,
-- 			COUNT(*) AS total_loans
-- 		FROM temp
-- 		WHERE loan_int_rate > 20
-- 		GROUP BY loan_grade, loan_intent, interest_category
-- 		ORDER BY loan_grade, loan_intent, interest_category DESC
-- 	) AS GROUPED_DATA
-- 	WHERE interest_category = 'High';


-- With Selector AS (
-- 	SELECT
-- 		CASE 
-- 			WHEN AVG(loan_int_rate) < 10 THEN 'Low'
-- 			WHEN AVG(loan_int_rate) BETWEEN 10 AND 20 THEN 'Medium'
-- 			ELSE 'High'
-- 		END AS avg_interests,
-- 		loan_grade,
-- 		COUNT(loan_grade) as total_grades,
-- 		loan_percent_income,
-- 		cb_person_cred_hist_length
-- 	FROM temp 
-- 	GROUP BY loan_grade, loan_percent_income, cb_person_cred_hist_length
-- 	ORDER BY loan_percent_income ASC
-- )
-- SELECT
-- 	avg_interests,
-- 	total_grades,
-- 	loan_grade
-- FROM Selector
-- ORDER BY total_grades DESC;
	
	
-- SELECT
-- 	loan_grade,
-- 	AVG(loan_int_rate) AS average_int_rate,
-- 	AVG(loan_percent_income) AS average_loan_percent_income,
-- 	AVG(cb_person_cred_hist_length) AS default_rate
-- FROM temp
-- GROUP BY loan_grade
-- ORDER BY loan_grade ASC;




-- Use later when all are done
-- drop table ApplicantDIM;
-- drop table RiskDIM;
-- drop table LoanDIM;
-- drop table LoanFact;


-- create table ApplicantDIM as 
-- select 
-- 	person_id,
-- 	person_age,
-- 	person_home_ownership,
-- 	person_emp_length
-- from temp;



-- create table RiskDIM (
-- 	default_dim_id SERIAL PRIMARY KEY,
-- 	current_loan_status VARCHAR(5),
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
-- from temp;



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
-- from temp;



-- create table MetricsDIM(
-- 	metrics_id SERIAL PRIMARY KEY
-- 	pred_prob NUMERIC(2,2),
-- 	pred_status INTEGER,
-- 	expected_loss NUMERIC(8,2),
-- 	decision VARCHAR(20),
-- 	risk VARCHAR(20)
-- )



-- create table LoanFact as
-- select distinct
-- 	m.metrics_id,
-- 	a.person_id,
-- 	r.default_dim_id,
-- 	l.loan_dim_id,
	
-- 	t.person_income,
-- 	t.loan_amount,
-- 	t.loan_int_rate,
-- 	t.loan_percent_income
-- from temp t
-- JOIN ApplicantDIM a
-- 	ON a.person_id = t.person_id

-- JOIN RiskDIM r
-- 	ON r.current_loan_status = t.loan_status
-- 	AND r.has_ever_defaulted = t.cb_person_default_on_file
-- 	AND r.credit_history = t.cb_person_cred_hist_length

-- JOIN LoanDIM l
-- 	ON l.loan_grade = t.loan_grade
-- 	AND l.loan_intent = t.loan_intent

-- -- check this later
-- JOIN MetricsDIM m
-- 	ON m.metrics_id = t.metrics_id



-- select a.person_id,
-- 	   l.loan_grade,
-- 	   l.loan_intent,
-- 	   lf.loan_amount,
-- 	   r.has_ever_defaulted
	   
-- from LoanFact lf
-- join LoanDIM l
-- on l.loan_dim_id = lf.loan_dim_id
-- join RiskDIM r
-- on r.default_dim_id = lf.default_dim_id
-- join ApplicantDIM a
-- on a.person_id = lf.person_id

-- where r.has_ever_defaulted = 'Y'
-- order by loan_grade, loan_amount DESC;




--  With Selector AS (
--  	select a.person_id,
-- 	   l.loan_grade as loan_grade,
-- 	   l.loan_intent as loan_intent,
-- 	   lf.loan_amount as loan_amount,
-- 	   r.has_ever_defaulted as has_ever_defaulted
	   
-- from LoanFact lf
-- join LoanDIM l
-- on l.loan_dim_id = lf.loan_dim_id
-- join RiskDIM r
-- on r.default_dim_id = lf.default_dim_id
-- join ApplicantDIM a
-- on a.person_id = lf.person_id

-- where r.has_ever_defaulted = 'Y'
--  )
--  SELECT
--  	loan_grade,
-- 	loan_intent,
--  	sum(loan_amount) as total_loan_amount,
-- 	count(DISTINCT person_id) as total_applicants
--  FROM Selector
--  GROUP BY loan_grade,
-- 	      loan_intent
--  ORDER BY total_loan_amount DESC




-- round(count(*) * 100.0 / 
	-- 	  sum(count(*)) over (),	
	-- 	  2) as percentage_of_total


-- select
-- 	l.loan_grade,
-- 	l.loan_intent,
-- 	a.person_home_ownership,
--     COUNT(*) AS total_applicants,
--     ROUND(
--         COUNT(*) * 100.0 /
--         SUM(COUNT(*)) OVER (),
--         2
--     ) AS percentage_of_total_homes_owned,
-- 	avg(a.person_emp_length) as average_employment_length,
-- 	avg(r.credit_history) as average_credit_history

-- FROM LoanFact lf
-- join ApplicantDIM a
-- on lf.person_id = a.person_id
-- join RiskDIM r
-- on lf.default_dim_id = r.default_dim_id
-- join LoanDIM l
-- on lf.loan_dim_id = l.loan_dim_id

-- GROUP BY l.loan_grade,l.loan_intent, a.person_home_ownership
-- ORDER BY loan_grade, percentage_of_total_homes_owned DESC;




-- select
-- 		l.loan_intent,
-- 		ROUND(
-- 			COUNT(r.has_ever_defaulted) * 100.0 /
-- 			SUM(COUNT(*)) OVER (),
-- 			2
-- 		) AS percentage_of_defaults
-- from LoanFact lf
-- join LoanDIM l
-- on lf.loan_dim_id = l.loan_dim_id
-- join RiskDIM r
-- on lf.default_dim_id = r.default_dim_id

-- where r.has_ever_defaulted = 'Y'

-- group by loan_intent
-- order by percentage_of_defaults DESC;


-- CREATE VIEW loan_grade_summary as

-- Select l.loan_grade,
-- 	   COUNT(*) AS total_applications,
	   
-- 	   ROUND(
--         AVG(lf.loan_amount),
--         2
-- 	    ) AS avg_loan_amount,
	
-- 	    ROUND(
-- 	        AVG(lf.loan_int_rate),
-- 	        2
-- 	    ) AS avg_interest_rate,
	
-- 	    ROUND(
-- 	        AVG(lf.loan_percent_income),
-- 	        2
-- 	    ) AS avg_loan_percent_income
	
-- 	FROM LoanFact lf
	
-- 	JOIN LoanDIM l
-- 	ON lf.loan_dim_id = l.loan_dim_id
	
-- 	GROUP BY l.loan_grade;


-- select * from temp;



	

	   

