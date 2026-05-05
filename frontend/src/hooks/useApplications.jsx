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
        setError(null)

        try {
            const data = await getApplications();
            setApplications(data) 
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
        
    }

    useEffect(() => {
        loadApplications()
    }, [])


    async function addApplication (app) {
        setError(null)

        try {
            const data = await createApplication(app)
            setApplications(prev => [...prev, data])
            
        } catch (err) {
            console.log("HOOK ERROR:", err.message)
            setError(err.message)
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