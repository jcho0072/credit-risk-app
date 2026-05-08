import {useState} from "react"

function ApplicationForm({addApplication}){
    const initialState = {     
        person_name: "",
        person_age: "",
        person_income: "",
        person_home_ownership: "",
        person_emp_length: "",
        loan_intent: "",
        loan_grade: "",
        loan_amnt: "",
        loan_int_rate: "",
        loan_percent_income: "",
        cb_person_default_on_file: "",
        cb_person_cred_hist_length: ""
    }

    const HOME_OWNERSHIP_OPTIONS = [
        "RENT",
        "OWN",
        "MORTGAGE",
        "OTHER"
    ]

    const LOAN_INTENT_OPTIONS = [
        "EDUCATION",
        "MEDICAL",
        "PERSONAL",
        "VENTURE",
        "HOMEIMPROVEMENT",
        "DEBTCONSOLIDATION"
    ]

    const LOAN_GRADE_OPTIONS = [
        "A",
        "B",
        "C",
        "D"
    ]
    
    const validation = {
        person_name: value => value.trim().length >= 2,
        person_age: value => value > 18,
        person_income: value => value >= 18 && value <= 100,
        person_home_ownership: value => HOME_OWNERSHIP_OPTIONS.includes(value),
        person_emp_length: value => value <= 50,
        loan_intent: value => LOAN_INTENT_OPTIONS.includes(value),
        loan_grade: value => LOAN_GRADE_OPTIONS.includes(value),
        loan_amnt: value => value <= 100000,
        loan_int_rate: value => value <= 100,
        loan_percent_income: value => value <= 1,
        cb_person_default_on_file: value =>["y","n"].includes(value),
        cb_person_cred_hist_length: value => 0

    }

    const [form, setForm] = useState(initialState)
    const [formError, setFormError] = useState({})
       
    function handleChange(e) {
        const {name, value, type} = e.target

        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault() // prevent page reload

        setFormError({
            person_name: "Required",
            person_age: "Invalid age"
        })

        addApplication(form)
        setForm(initialState)
}

    const fields = [
        {name:"person_name", placeholder:"Name"},
        {name:"person_age", type:"number", placeholder:"Age"},
        {name: "person_income", type:"number", placeholder:"Income"},
        {name: "person_home_ownership", placeholder:"Ownership"},
        {name: "person_emp_length", type:"number", placeholder:"Person Employee Length"},
        {name: "loan_intent", type:"select", placeholder:"Loan intent", options:HOME_OWNERSHIP_OPTIONS},
        {name: "loan_grade",type:"select", placeholder:"Loan grade", options:LOAN_GRADE_OPTIONS},
        {name: "loan_amnt", type:"number", placeholder:"Loan amount"},
        {name: "loan_int_rate", type:"number", placeholder:"Loan interest rate"},
        {name: "loan_percent_income", type:"number", placeholder:"Loan percent income"},
        {name: "cb_person_default_on_file", placeholder:"Has Ever Defaulted?"},
        {name: "cb_person_cred_hist_length", type:"number", placeholder:"Credit history"}
    ]


    return (
        <div>
            <form className = "form" onSubmit={handleSubmit}>

                {fields.map(f =>
                    {
                        if (f.type === "select") {
                            return (
                                <select
                                    key={f.name}
                                    name={f.name}
                                    value={form[f.name]}
                                    onChange={handleChange}
                                >

                                    <option value = "">Select option</option>

                                    {f.options.map(option => (
                                        <option key={option} value={option}></option>  
                                    ))}

                                </select>
                            )
                        }
                        return (
                            <input
                                key={f.name}
                                name={f.name}
                                type={f.type || "text"}
                                value={form[f.name]}
                                onChange={handleChange}
                            />)
                    })}

                    <button type="submit">
                        Add application
                    </button>

            </form>
        </div>
    )

}

export default ApplicationForm