import {useState} from "react"
import {useEffect} from "react"

function ApplicationItem({application, deleteApplication, updateApplication}){
    const [editing,setEditing] = useState(false)
    const [form,setForm] = useState(application)

    useEffect(() => {
        setForm(application)
    }, [application])

    function handleChange(e){
        const {name, value, type} = e.target

        setForm(prev => ({
            ...prev,
            [name]: type === "number"
                 ? value === "" ? "" : Number(value)
                 : value
        }))
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
            <li>
                {(editing ? (
                    <>

                    <div>
                        <form className = "form">
                            {fields.map(f =>
                    <div key={f.name}>
                    
                    <label>
                        {f.placeholder}
                    </label>

                    <input
                        name= {f.name}
                        type={f.type || "text"}
                        value={form[f.placeholder]} 
                        onChange={handleChange} 
                        // placeholder={f.placeholder} 
                    
                    />

                </div>
                )}
                        </form>
                    </div>


                <button onClick={() => {
                    updateApplication(application.id, form)
                    setEditing(false)
                }}>
                    Save
                </button>

                    </>
                ): (
                    <>
                    <div className="display">
                           
                        <div>
                            Name: {form.person_name || "Unnamed"} 
                        </div>

                        <div>
                            Age: {form.person_age}
                        </div>
                        
                        <br />  
                        Probability: {form.pred_probability ?? "N/A"}
                        <br /> 

                        <div>  
                        Loan Status: {form.pred_status ?? "N/A"}
                        </div>

                        <div>  
                        Decision: {form.decision ?? "N/A"}
                        </div> 

                        <div>  
                        Risk: {form.risk ?? "N/A"}
                        </div>

                        <br/>
                        <br/> 
                                                                                     
                        
                    </div>


                    <button onClick={() => deleteApplication(application.id)}>
                    Delete
                    </button>
                        
                    <button onClick={() => setEditing(true)}>
                        Edit
                    </button>
                   </> 
                )
                )}
            </li>
    )

}

export default ApplicationItem