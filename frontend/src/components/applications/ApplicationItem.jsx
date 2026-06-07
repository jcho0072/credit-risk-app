import {useState} from "react"
import {useEffect} from "react"

import {fields} from "../../config/applicationFields"
import {validation,
        validationMessages
} from "../../config/applicationValidation"

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

        updateApplication(application.application_id, form)
        setEditing(false)
    }
    

    return (
        <li className="app-card">
            {editing ? (
                <div>
                    <h4 style={{ margin: "0 0 16px 0", color: "var(--text-h)" }}>Edit Application</h4>
                    <form className="form-edit-grid" onSubmit={handleSubmit}>
                        <div className="form-fields-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                            {fields.map(f => {
                                if (f.type === "select") {
                                    return (
                                        <div key={f.name} className="form-field">
                                            <label htmlFor={`edit-${f.name}-${application.application_id}`}>{f.placeholder}</label>
                                            <select
                                                id={`edit-${f.name}-${application.application_id}`}
                                                name={f.name}
                                                value={form[f.name]}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select option</option>
                                                {f.options.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[f.name] && <p className="error-msg">{errors[f.name]}</p>}
                                        </div>
                                    )
                                }

                                return (
                                    <div key={f.name} className="form-field">
                                        <label htmlFor={`edit-${f.name}-${application.application_id}`}>{f.placeholder}</label>
                                        <input
                                            id={`edit-${f.name}-${application.application_id}`}
                                            name={f.name}
                                            type={f.type || "text"}
                                            value={form[f.name]}
                                            onChange={handleChange}
                                        />
                                        {errors[f.name] && <p className="error-msg">{errors[f.name]}</p>}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="app-actions">
                            <button type="submit" className="btn btn-primary" id={`btn-save-${application.application_id}`}>
                                Save
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)} id={`btn-cancel-${application.application_id}`}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="app-card-header">
                        <div className="app-applicant-info">
                            <h4>{form.person_name || "Unnamed"}</h4>
                            <span>Age {form.person_age} • Income: ${form.person_income ? form.person_income.toLocaleString() : "N/A"}</span>
                        </div>
                        <div className="app-badges">
                            {form.decision && (
                                <span className={`status-badge ${form.decision.toLowerCase()}`}>
                                    {form.decision}
                                </span>
                            )}
                            {form.risk && (
                                <span className={`status-badge ${form.risk.toLowerCase().replace(" ", "-")}`}>
                                    {form.risk}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="app-details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Home Ownership</span>
                            <span className="detail-value">{form.person_home_ownership || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Emp. Length</span>
                            <span className="detail-value">{form.person_emp_length !== undefined ? `${form.person_emp_length} yrs` : "N/A"}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Loan Intent</span>
                            <span className="detail-value" style={{ textTransform: "capitalize" }}>{form.loan_intent || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Loan Grade</span>
                            <span className="detail-value">Grade {form.loan_grade || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Loan Amount</span>
                            <span className="detail-value">${form.loan_amnt ? form.loan_amnt.toLocaleString() : "N/A"}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Interest Rate</span>
                            <span className="detail-value">{form.loan_int_rate ? `${form.loan_int_rate}%` : "N/A"}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">% Income</span>
                            <span className="detail-value">{form.loan_percent_income ? `${(form.loan_percent_income * 100).toFixed(0)}%` : "N/A"}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Credit History</span>
                            <span className="detail-value">{form.cb_person_cred_hist_length ? `${form.cb_person_cred_hist_length} yrs` : "N/A"}</span>
                        </div>
                    </div>

                    {/* Progress Bar / Visual assessment inspired by Analytics */}
                    <div className="app-prediction-section">
                        <div className="prediction-header">
                            <span>Predicted Default Probability</span>
                            <span style={{ fontWeight: 600 }}>
                                {form.pred_probability !== undefined && form.pred_probability !== null 
                                    ? `${(form.pred_probability * 100).toFixed(1)}%` 
                                    : "N/A"}
                            </span>
                        </div>
                        {form.pred_probability !== undefined && form.pred_probability !== null && (
                            <div className="progress-bar-bg" style={{ background: "rgba(0, 0, 0, 0.1)" }}>
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ 
                                        width: `${form.pred_probability * 100}%`,
                                        background: form.pred_probability > 0.2 ? "#ef4444" : form.pred_probability > 0.1 ? "#f59e0b" : "#22c55e"
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "4px" }}>
                            Predicted Default Status: <strong style={{ color: "var(--text-h)" }}>{form.pred_status === 1 ? "DEFAULT" : "NON-DEFAULT"}</strong>
                        </div>
                    </div>

                    <div className="app-actions">
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => setEditing(true)} 
                            id={`btn-edit-${application.application_id}`}
                        >
                            Edit
                        </button>
                        <button 
                            className="btn btn-danger" 
                            onClick={() => deleteApplication(application.application_id)}
                            id={`btn-delete-${application.application_id}`}
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </li>
    )

}

export default ApplicationItem