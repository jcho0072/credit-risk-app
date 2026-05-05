import {useState, useEffect} from "react"

import {useApplications} from "../hooks/useApplications"

import ApplicationForm from "../components/ApplicationForm"
import ApplicationList from "../components/ApplicationList"
import ApplicationItem from "../components/ApplicationItem"

function CreditPage(){

    const {
        applications,
        loading,
        error,
        addApplication,
        deleteApplication,
        updateApplication
    } = useApplications() 

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
                
                {error && <p>{error}</p>}
            </div>
        </div>
    )

}

export default CreditPage

