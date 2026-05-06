import {useState, useEffect} from "react"

import {useApplications} from "../hooks/useApplications"

import ApplicationForm from "../components/ApplicationForm"
import ApplicationList from "../components/ApplicationList"

function CreditPage(){

    const {
        applications,
        loading,
        error,
        addApplication,
        deleteApplication,
        updateApplication
    } = useApplications() 

    if (loading) {
        return <p>
                Loading applications ...
            </p>
            }
    
    if (error) {
        return <p>{error}</p>
    }

    return (
        <div>
            <h2>
                Applications
            </h2>
            
            <div className="layout">

                <ApplicationForm addApplication = {addApplication}/>
            
                <div>
                    <ApplicationList 
                    applications={applications}
                    deleteApplication={deleteApplication}
                    updateApplication={updateApplication}    
                    />
                </div>
                
                
            </div>
        </div>
    )

}

export default CreditPage

