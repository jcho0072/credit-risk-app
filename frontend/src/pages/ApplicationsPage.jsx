import {useState, useEffect} from "react"

import {useApplications} from "../hooks/useApplications"

import ApplicationForm from "../components/applications/ApplicationForm"
import ApplicationList from "../components/applications/ApplicationList"
import ApplicationSearch from "../components/applications/ApplicationSearch"

function ApplicationsPage(){
    const [nameInput, setNameInput] = useState("")
    const [debouncedName, setDebouncedName] = useState("")
    const [page, setPage] = useState(1)
    const [limit] = useState(4)
    const [risk, setRisk] = useState("")
    const [loanStatus, setLoanStatus] = useState("")
    const [decision, setDecision] = useState("")

    // Debounce effect for name search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(nameInput)
        }, 500)
        return () => clearTimeout(handler)
    }, [nameInput])

    // Reset page to 1 when any filter changes
    useEffect(() => {
        setPage(1)
    }, [debouncedName, risk, loanStatus, decision])

    const filters = {
        page,
        limit,
        name: debouncedName,
        risk,
        loanStatus,
        decision
    }

    const {
        applications,
        isLoading,
        error,
        totalPages,
        totalCount,
        addApplication,
        updateApplication,
        deleteApplication
    } = useApplications(filters)

    if (isLoading) {
        return <p>Loading applications...</p>
    }
    
    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className="credit-page-container">
            <header className="credit-page-header">
                <h2>Credit Applications</h2>
                <span className="badge">Total: {totalCount} records</span>
            </header>
            
            <div className="credit-grid">
                <aside className="credit-sidebar">
                    <ApplicationSearch 
                        nameInput={nameInput}
                        setNameInput={setNameInput}

                        risk={risk}
                        setRisk={setRisk}

                        loanStatus={loanStatus}
                        setLoanStatus={setLoanStatus}

                        decision={decision}
                        setDecision={setDecision}
                    />

                    <ApplicationForm addApplication={addApplication}/>
                </aside>
            
                <main className="app-list-container">
                    <ApplicationList 
                        applications={applications}
                        deleteApplication={deleteApplication}
                        updateApplication={updateApplication}    
                    />

                    <div className="pagination">
                        <button 
                            className="btn btn-secondary"
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            id="btn-prev-page"
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button 
                            className="btn btn-secondary"
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => setPage(prev => prev + 1)}
                            id="btn-next-page"
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )

}

export default ApplicationsPage
