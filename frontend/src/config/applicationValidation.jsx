        import {HOME_OWNERSHIP_OPTIONS,
        LOAN_INTENT_OPTIONS,
        LOAN_GRADE_OPTIONS
} from "../config/applicationFieldSelections"

export const validation = { // add loan_status
        person_name: value => value.trim().length >= 2 ,
        person_age: value => value > 18 && value !== "",
        person_income: value => value > 0 && value !== "",
        person_home_ownership: value => HOME_OWNERSHIP_OPTIONS.includes(value),
        person_emp_length: value => value > 0 && value <= 50 && value !== "",
        loan_intent: value => LOAN_INTENT_OPTIONS.includes(value),
        loan_grade: value => LOAN_GRADE_OPTIONS.includes(value),
        loan_amnt: value => value > 0 && value <= 100000 && value !== "",
        loan_int_rate: value => value <= 100 && value !== "",
        loan_percent_income: value => value <= 1 && value !== "",
        cb_person_default_on_file: value =>["Y","N"].includes(value),
        cb_person_cred_hist_length: value => value > 0 && value !== ""
    }

export const validationMessages = {  // add loan_Status
        person_name: "Name must not be empty",
        person_age: "Age must be between 18 and 100 or must not be empty",
        person_income: "Income must not be 0 or empty",
        person_home_ownership: "Home ownership option must not be empty",
        person_emp_length: "Employee length must not be 0",
        loan_intent: "Loan intent must not be empty",
        loan_grade: "Loan grade must not be empty",
        loan_amnt: "Loan amount must be less than 100k or more than 0",
        loan_int_rate: "Interest must be less than 100 percent",
        loan_percent_income: "Cannot exceed 1",
        cb_person_default_on_file: "Cannot be empty",
        cb_person_cred_hist_length: "Credit history must not be empty"
}