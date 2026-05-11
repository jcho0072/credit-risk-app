import {useState} from "react"
import {useEffect} from "react"

import {fields} from "../config/applicationFields"
import {validation,
        validationMessages
} from "../config/applicationValidation"

function ApplicationItem({application, deleteApplication, updateApplication}){
    const [editing,setEditing] = useState(false)
    const [form,setForm] = useState(application)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        setForm(application)
    }, [application])

    function handleChange(e){
        const {name, value, type} = e.target

         setForm(prev => ({
            ...prev,
            [name]:type === "number"
            ? value === "" ? "" : Number(value)
            : value
        }))

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]:""
            }))
        }
    }

    function handleSubmit(e) {
        e.preventDefault() // prevent page reload

        const newErrors = {}

        Object.keys(validation).forEach(field => {
            const isValid = validation[field](form[field])

            if (!isValid) {
                newErrors[field] = validationMessages[field]
            }
        })

        if (Object.keys(newErrors).length > 0){
            setErrors(newErrors)
            console.log("Error confirmed")
            return
        }

        setErrors({})

        updateApplication(application.id, form)
        setEditing(false)
    }
    

    return (
            <li>
                {(editing ? (
                    <>
                    <div>
                        <form className = "form" onSubmit={handleSubmit}>

                            {fields.map(f => {
                                if (f.type === "select") {
                                    return ( 
                                    <div key={f.name} className="form-field">
                                        
                                    <select
                                    name={f.name}
                                    value={form[f.name]}
                                    onChange={handleChange}
                                    placeholder={f.placeholder}
                                >

                                    <option value = "">Select option</option>

                                     {f.options.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                     ))}

                                </select>
                                </div>
                                
                                    )
                                }

                                return (
                                    <div key={f.name} className="form-field">

                                        <label>
                                            {f.placeholder}
                                        </label>

                                    <input
                                    name={f.name}
                                    type={f.type || "text"}
                                    value={form[f.name]}
                                    onChange={handleChange}
                                    placeholder={f.placeholder}
                                />

                                    {errors[f.name] && (
                                        <p>{errors[f.name]}</p>
                                    )}

                                    </div>
                                )
                            }

            )}
                        <button type="submit">
                            Save
                        </button>
                    </form>
                </div>


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