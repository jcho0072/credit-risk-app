import {HOME_OWNERSHIP_OPTIONS,
        LOAN_INTENT_OPTIONS,
        LOAN_GRADE_OPTIONS
} from "../config/applicationFieldSelections"

export const fields = [   // add loan_status
        {name:"person_name", placeholder:"Name"},
        {name:"person_age", type:"number", placeholder:"Age"},
        {name: "person_income", type:"number", placeholder:"Income"},
        {name: "person_home_ownership", type:"select", placeholder:"Ownership", options:HOME_OWNERSHIP_OPTIONS},
        {name: "person_emp_length", type:"number", placeholder:"Person Employee Length"},
        {name: "loan_intent", type:"select", placeholder:"Loan intent", options:LOAN_INTENT_OPTIONS},
        {name: "loan_grade",type:"select", placeholder:"Loan grade", options:LOAN_GRADE_OPTIONS},
        {name: "loan_amnt", type:"number", placeholder:"Loan amount"},
        {name: "loan_int_rate", type:"number", placeholder:"Loan interest rate"},
        {name: "loan_percent_income", type:"number", placeholder:"Loan percent income"},
        {name: "cb_person_default_on_file", type:"select", placeholder:"Has Ever Defaulted?", options:["Y","N"]},
        {name: "cb_person_cred_hist_length", type:"number", placeholder:"Credit history"}
    ]