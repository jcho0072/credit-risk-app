// Custom hook 

import { useQuery } from "@tanstack/react-query";

import {getApplications,
        createApplication,
        updateApplication,
        deleteApplication
} from "../api/applications"


export function useApplications() {
    // Consolidated filtered state
    
    // const [filters, setFilters] = useState({
    //     "page":1,
    //     "limit":4,
    //     name:"",
    //     risk:"",
    //     loanStatus:"",
    //     decision:""
    // })  //go to Component/Page

    

    // const updateFilter = (key, value) => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         [key]: value,
    //         page: key !== 'page' ? 1 : value.page
    //     }))
    // }  // go to Component/Page
    
    // TanStack Query automatically fetches and caches when filters change
    const {data, isLoading, error} = useQuery({
        queryKey: ['applications', filters],
        queryFn: () => getApplications(filters)
    })

    return ({
        applications: data?.data || [],
        totalPages: data?.pagination?.totalPages || 0,
        totalCount: data?.pagination?.totalCount || 0,
        isLoading,
        error
    })
}

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

