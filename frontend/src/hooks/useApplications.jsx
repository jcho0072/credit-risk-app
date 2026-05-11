// Custom hook 

import {useState, useEffect} from "react"

import {getApplications,
        createApplication,
        updateApplication,
        deleteApplication
} from "../api/applications"


export function useApplications() {
    const [applications, setApplications] = useState([])

    const [page, setPage] = useState(1)
    const [limit, setLimit]= useState(20)
    const [totalPages, setTotalPages] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    function mapErrorToMessage(err) {
        if (!err || !err.message) {
            return "Something went wrong. Please try again."
        }
        if (err.message.includes("Network") || err.message.includes("Failed to fetch")) {
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
            const result = await getApplications(page,limit);

            if (!Array.isArray(result.data)) {
                throw new Error("Invalid data format")
            }

            setApplications(result.data)

            setTotalPages(result.pagination.totalPages)
            setTotalCount(result.pagination.totalCount)

        } catch (err) {
            const userMessage = mapErrorToMessage(err)
            setError(userMessage)
            
        } finally {
            setLoading(false)
        }
        
    }

    useEffect(() => {
        loadApplications()
    }, [page, limit])


    async function addApplication (app) {
        setLoading(true)
        setError(null)
        try {
            const result = await createApplication(app)
            setApplications(prev => [...prev, result])
            
        } catch (err) {
            setError(mapErrorToMessage(err))
            
        } finally {
            setLoading(false)
        }
    }


     async function removeApplication (id) {
        setLoading(true)
        setError(null)
        try {
            const result = await deleteApplication(id)
            setApplications((prev) => prev.filter(t => t.id !== id))
       } catch (err){
            
            setError(mapErrorToMessage(err))
       } finally {
            setLoading(false)
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
        setLoading(true)
        setError(null)
        try {
            const result = await updateApplication(id, app)
            setApplications(prev => prev.map(a => a.id === result.id? result : a))
       } catch (err){
            
            setError(mapErrorToMessage(err))
       } finally {
        setLoading(false)
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