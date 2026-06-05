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
    const [limit, setLimit]= useState(4)
    const [totalPages, setTotalPages] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    
    const [name, setName] = useState("") 
    const [nameInput, setNameInput] = useState("")

    const [risk, setRisk] = useState("")
    const [loanStatus, setLoanStatus] = useState("")
    const [decision, setDecision] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    function mapErrorToMessage(err) {
        if (!err || !err.message) {
            return "Something went wrong. Please try again."
        }
        // if (err.message.includes("Failed to fetch")) {
        //     return "Unable to connect. Check your internet or try again."
        // }
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
            const result = await getApplications(page, limit, name, risk, loanStatus, decision)

            if (!Array.isArray(result.data)) {
                throw new Error("Invalid data format")
            }

            setApplications(result.data)
            setTotalPages(result.pagination.totalPages)

            if (result.pagination.page > result.pagination.totalPages){
                setTotalPages(result.pagination.totalPages)
            }

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
    }, [page, limit, name, risk, loanStatus, decision])


    useEffect(() => {
        const timer = setTimeout(() => {
            setName(nameInput)
            setPage(1)
        }, 500)
        
        return () => {
            clearTimeout(timer)
        }
    }, [nameInput])

    
    


    async function addApplication (app) {
        setLoading(true)
        setError(null)
        try {
            await createApplication(app)
            await loadApplications()
            
        } catch (err) {
            setError(mapErrorToMessage(err))
            
        } finally {
            setLoading(false)
        }
    }


     async function removeApplication (application_id) {
        setLoading(true)
        setError(null)
        try {
            await deleteApplication(application_id)
            
            await loadApplications()
            // setApplications((prev) => prev.filter(t => t.id !== id))
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

    async function updateApp (application_id, app) {
        setLoading(true)
        setError(null)
        try {
            const result = await updateApplication(application_id, app)
            const updatedApp = result.data
            setApplications(prev => prev.map(a => a.application_id === updatedApp.application_id ? updatedApp : a))
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
        
        page,
        limit,

        setPage,
        setLimit,
        
        totalPages,
        totalCount,

        name,
        nameInput,

        setName,
        setNameInput,
        
        risk,
        loanStatus,
        decision,

        setRisk,
        setLoanStatus,
        setDecision,

        addApplication,
        deleteApplication: removeApplication,
        updateApplication: updateApp

    }

}