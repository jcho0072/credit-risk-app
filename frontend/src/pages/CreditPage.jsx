import {useState, useEffect} from "react"

import {useApplications} from "../hooks/useApplications"

import ApplicationForm from "../components/applications/ApplicationForm"
import ApplicationList from "../components/applications/ApplicationList"
import ApplicationSearch from "../components/applications/ApplicationSearch"

function CreditPage(){

    const {
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
        setLoanStatus,   // name change
        setDecision,

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
                            disabled={page === totalPages}
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

export default CreditPage

