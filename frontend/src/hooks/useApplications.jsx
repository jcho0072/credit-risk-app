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

    function mapErrorToMessage(err) {
        if (!err || !err.message) {
            return "Something went wrong. Please try again."
        }
        if (err.message.includes("Network")) {
            return "Unable to connect. Check your internet or try again."
        }
        if (err.message.includes("Invalid response")) {
            return "Server returned an unexpected response"
        }

        // Backend message fallback
        return err.message
    }


    async function loadApplications () {
        setLoading(true)
        setError(null)

        try {
            const data = await getApplications();
            setApplications(data) 
        } catch (err) {
            console.log("HOOK ERROR:", err.message)
            setError(mapErrorToMessage(err))
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
            setError(mapErrorToMessage(err))
            
        } 
    }


     async function removeApplication (id) {
        setError(null)
        try {
            const data = await deleteApplication(id)
            setApplications((prev) => prev.filter(t => t.id !== id))
       } catch (err){
            console.log("HOOK ERROR:", err.message)
            setError(mapErrorToMessage(err))
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
            console.log("HOOK ERROR:", err.message)
            setError(mapErrorToMessage(err))
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