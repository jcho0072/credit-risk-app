// Custom hook 

import {useState, useEffect} from "react"

import {getApplications,
        createApplication,
        updateApplication,
        deleteApplication
} from "../api/applications"


export function useApplications() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function loadApplications () {
        setLoading(true)
        try {
            const data = await getApplications();
            console.log("FRONTEND RECEIVED:", data)
            setApplications(data)   
        } catch (err) {
            setLoading(err)
        } finally {
            setLoading(false)
        }
        
    }

    useEffect(() => {
        loadApplications()
    }, [])


    async function addApplication (app) {
        console.log("ADDING:", app)
        try {
            const data = await createApplication(app)
            console.log("RESPONSE:", app)

            // console.log("TYPE:", typeof data)
            // console.log("IS ARRAY:", Array.isArray(data))
            // console.log("DATA:", JSON.stringify(data))
            // console.log("ID:", data.id)

            setApplications(prev => [...prev, data])
            
            
        } catch (err) {
            setLoading(err)
        } 
    }

     async function removeApplication (id) {
        try {
            const data = await deleteApplication(id)
            setApplications((prev) => prev.filter(t => t.id !== id))
       } catch (err){
            setError(err)
       }
    }

    // async function clearApplications() {
    // try {
    //     await deleteAllApplications()
    //     setApplications([])   // update UI immediately
    // } catch (err) {
    //     setError(err)
    //     }
    // }

    async function updateApp (id, app) {
       try {
            const data = await updateApplication(id, app)
            setApplications(prev => prev.map(a => a.id === data.id? data : a))
       } catch (err){
            setError(err)
       } 
    }

    return {
        applications,
        loading,
        error,
        addApplication,
        deleteApplication: removeApplication,
        updateApplication: updateApp

    }

}