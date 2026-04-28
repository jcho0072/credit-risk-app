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

    const [form, setForm] = useState(initialState)
       
    function handleChange(e) {
        const {name, value, type} = e.target

        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault() // prevent page reload
        addApplication(form)
        setForm(initialState)
}

    const fields = [
        {name:"person_name", placeholder:"Name"},
        {name:"person_age", type:"number", placeholder:"Age"},
        {name: "person_income", type:"number", placeholder:"Income"},
        {name: "person_home_ownership", placeholder:"Ownership"},
        {name: "person_emp_length", type:"number", placeholder:"Person Employee Length"},
        {name: "loan_intent", placeholder:"Loan intent"},
        {name: "loan_grade", placeholder:"Loan grade"},
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
                <div key={f.name}>

                    <label>
                        {f.placeholder}
                    </label>

                    <input
                        name= {f.name}
                        type={f.type || "text"}
                        value={form[f.name]} 
                        onChange={handleChange} 
                        // placeholder={f.placeholder} 
                    
                    />

                </div>
                )}

                    <button type="submit">
                        Add application
                    </button>

            </form>
        </div>
    )

}

export default ApplicationForm