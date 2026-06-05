import {useState} from "react"


import {initialState} from "../config/applicationState"
import {HOME_OWNERSHIP_OPTIONS,
        LOAN_INTENT_OPTIONS,
        LOAN_GRADE_OPTIONS
} from "../config/applicationFieldSelections"
import {fields} from "../config/applicationFields"
import {validation,
        validationMessages
} from "../config/applicationValidation"



function ApplicationForm({addApplication}){
    
    const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState({})
       
    function handleChange(e) {
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

        addApplication(form)
        setForm(initialState)
}



    return (
        <div>
            <form className = "form" onSubmit={handleSubmit}>

                {fields.map(f =>
                    {
                        if (f.type === "select") {       
                            return (
                                <div key={f.name} className="form-field">
                                    
                                <label>
                                    {f.placeholder}
                                </label>

                                <select
                                    key={f.name}
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

                                {errors[f.name] && (
                                        <p>{errors[f.name]}</p>
                                    )}

                                </div>

                                
                            )
                        }

                        return (
                            <div key={f.name} className="form-field">

                                <label>
                                    {f.placeholder}
                                </label>

                            <input
                                key={f.name}
                                name={f.name}
                                type={f.type || "text"}
                                value={form[f.name]}
                                onChange={handleChange}
                                // placeholder={f.placeholder}
                            />
                            
                            {errors[f.name] && (
                                <p>{errors[f.name]}</p>
                            )}
                            
                            </div>
                        )
                    })}

                    <button type="submit">
                        Add application
                    </button>

                    

            </form>
        </div>
    )

}

export default ApplicationForm