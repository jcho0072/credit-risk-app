import {useState, useEffect} from "react"

import ApplicationForm from "../components/ApplicationForm"
import ApplicationList from "../components/ApplicationList"
import ApplicationItem from "../components/ApplicationItem"

function CreditPage(){
    const [applications, setApplications] = useState([])
    // const [query, setQuery] = useState("")

    const url = `${import.meta.env.VITE_API_URL}`;

    async function loadApplications () {
        const res = await fetch(`${url}/applications` ,{
            method:'GET',
        })

        const data = await res.json()
        setApplications(data)
    }

    useEffect(() => {
        loadApplications()
    }, [])


    async function addApplication (application) {
        const res = await fetch(`${url}/applications`, {
            method: 'POST',     
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(application)
        })

        const data = await res.json()
        setApplications(prev => [...prev, data])

        // console.log(data.pred_probability)

    }

    async function deleteApplication (id) {
        const res = await fetch(`${url}/applications/${id}`, {
            method:'DELETE'
        })

        const data = await res.json()

        setApplications((prev) => prev.filter(t => t.id !== id))
        
    }

    async function updateApplication (id, application) {
        const res = await fetch(`${url}/applications/${id}`, {
            method: 'PUT',
            headers: {
                "Content-type" : "application/json"
            },
            body:JSON.stringify(application)  
        })

        const data = await res.json()
        setApplications(prev => prev.map(a => a.id === data.id? data : a))
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

