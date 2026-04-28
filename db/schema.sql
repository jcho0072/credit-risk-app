-- ALTER USER ml_user QUOTA 100M ON USERS;

-- DROP TABLE CREDIT_DATA;

-- CREATE TABLE credit_data (
--     person_age NUMBER,
--     person_income NUMBER,
--     person_home_ownership VARCHAR2(50),
--     person_emp_length NUMBER,
--     loan_intent VARCHAR2(50),
--     loan_grade VARCHAR2(5),
--     loan_amnt NUMBER,
--     loan_int_rate NUMBER,
--     loan_status NUMBER,
--     loan_percent_income NUMBER,
--     cb_person_default_on_file VARCHAR2(5),
--     cb_person_cred_hist_length NUMBER
-- );

select * from CREDIT_DATA;







-- Data Profiling

-- -- Average income
-- SELECT 
--     MIN(person_income) AS minimum_income,
--     MAX(person_income) AS maximum_income,
--     AVG(person_income) AS average_income
-- FROM credit_data;

-- -- Outlier detection  
-- SELECT *
-- FROM credit_data
-- WHERE person_income > 5000000;



-- -- Missing values 
-- SELECT 
--     COUNT(*) AS total,
--     COUNT(person_income) AS income_non_null
-- FROM credit_data;


-- -- Categorical values
-- SELECT person_home_ownership, COUNT(*)
-- FROM credit_data
-- group by person_home_ownership;


-- -- Logical constraints
-- SELECT * 
-- FROM CREDIT_DATA
-- WHERE PERSON_EMP_LENGTH < 0;

-- SELECT *
-- FROM CREDIT_DATA
-- WHERE person_age < 0;

-- SELECT * 
-- FROM CREDIT_DATA
-- WHERE person_age > 100;

-- SELECT PERSON_AGE, PERSON_INCOME, LOAN_AMNT, COUNT(*)
-- FROM CREDIT_DATA
-- GROUP BY  PERSON_AGE, PERSON_INCOME, LOAN_AMNT
-- HAVING COUNT(*) > 1;



-- -- Duplicate Standardization
-- SELECT DISTINCT person_home_ownership FROM CREDIT_DATA;






-- -- Relationships
-- SELECT AVG(loan_amnt), loan_status
-- FROM credit_data
-- GROUP BY loan_status;

-- SELECT 
--     loan_status, AVG(person_income) AS Average_Income,
--     COUNT(*) AS count
-- FROM credit_data
-- GROUP BY loan_status;




-- -- Bucket income (ver 1)
-- WITH base AS (
--     SELECT 
--         loan_status,
--         person_income,
--         AVG(person_income) OVER () AS avg_income
--     FROM credit_data
-- )
-- SELECT
--     loan_status,
--     person_income,
--     CASE 
--         WHEN person_income < avg_income / 2 THEN 'LOW'
--         WHEN person_income < avg_income THEN 'MID'
--         ELSE 'HIGH'
--     END AS income_group
-- FROM base;




-- 1.1 (how many nulls exist per column)

-- -- Wrong Version
-- -- This is 
--     -- What combinations of NULL/non-NULL rows exist?

-- SELECT  
--     person_income AS null_income,
--     loan_int_rate AS null_interest,
--     person_emp_length AS null_emp_length,
--     COUNT(*) AS total_rows -- this likely doesnt do anything
-- FROM CREDIT_DATA
-- WHERE person_income is NULL and
--       loan_int_rate is NULL and
--       person_emp_length is NULL
-- GROUP BY person_income, loan_int_rate, person_emp_length;



-- -- Proper Version 
-- SELECT 
--     COUNT(*) AS total_rows,
--     SUM(CASE WHEN person_income IS NULL THEN 1 ELSE 0 END) AS null_income,
--     SUM(CASE WHEN loan_int_rate IS NULL THEN 1 ELSE 0 END) AS null_interest,
--     SUM(CASE WHEN person_emp_length IS NULL THEN 1 ELSE 0 END) AS null_emp_length
-- FROM CREDIT_DATA;






-- -- 1.2 
-- -- Return all rows where:
--     -- income is NULL
--     -- OR employment length is NULL

-- SELECT 
--     *
-- FROM CREDIT_DATA
-- WHERE   
--     person_income is null OR
--     person_emp_length is NULL;


-- -- 1.3
-- -- Conditional nulls (important)
--     -- How many NULL person_income rows have loan_status = 1?

-- SELECT COUNT(person_income) as total_rows_no_default 
-- FROM CREDIT_DATA
-- WHERE loan_status = 1
--       AND person_income is NULL;



-- --2.1
-- SELECT person_age, person_income, loan_percent_income
-- FROM CREDIT_DATA
-- WHERE person_age < 18
--       OR person_income <= 0
--       OR loan_percent_income > 1;


-- -- 2.2
-- SELECT 
--     CASE 
--         WHEN person_income <= 0 THEN 'INVALID_INCOME'
--         WHEN person_age < 18 THEN 'INVALID AGE'
--         WHEN loan_percent_income > 1 THEN 'INVALID_RATIO'
--         ELSE 'VALID'
--     END AS validation_flag,
--     COUNT(*) AS count
--     FROM CREDIT_DATA
--     GROUP BY
--         CASE
--             WHEN person_income <= 0 THEN 'INVALID_INCOME'
--             WHEN person_age < 18 THEN 'INVALID AGE'
--             WHEN loan_percent_income > 1 THEN 'INVALID_RATIO'
--             ELSE 'VALID'
--         END;


-- -- 3.1 
-- SELECT DISTINCT person_home_ownership
-- FROM CREDIT_DATA;

-- SELECT DISTINCT loan_intent
-- FROM CREDIT_DATA;


-- -- 4.1
-- select loan_status,
--        CASE 
--             WHEN person_income < 30000 then 'LOW'
--             WHEN person_income between 30000 and 70000 then 'MID'
--             ELSE 'HIGH'
--         END AS income_group,
--         COUNT(*) AS total_rows
--         FROM CREDIT_DATA
--         group by loan_status,
--             CASE 
--                 WHEN person_income < 30000 then 'LOW'
--                 WHEN person_income between 30000 and 70000 then 'MID'
--                 ELSE 'HIGH'
--             END
--         ORDER BY loan_status;



-- -- 5.1 / 5.3
-- with base as (
--     select
--         person_income, 
--         loan_status, 
--         avg(person_income) over () as avg_income
--     from credit_data
--     where loan_status = 0
-- )
-- select count(loan_status) as defaulted_loans
-- from base
-- where person_income > avg_income;


-- -- multiple condition querying, with named attr usage
--    -- use when you have 
-- with base as (
--     select
--         person_income, 
--         loan_status, 
--         avg(person_income) over () as avg_income
--     from credit_data
--     where loan_status = 0
-- ),
-- filtered AS (
--     SELECT *
--     FROM base
--     WHERE person_income > avg_income
-- )
--     SELECT COUNT(*) over () AS total_above_avg
-- FROM filtered;

