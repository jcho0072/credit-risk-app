import {useState, useEffect} from "react"

import {useApplications} from "../hooks/useApplications"

import ApplicationForm from "../components/ApplicationForm"
import ApplicationList from "../components/ApplicationList"

function CreditPage(){

    const {
        applications,

        loading,
        error,

        page,
        limit,
        search,
        searchInput,
        totalPages,
        totalCount,

        setPage,
        setLimit,
        setSearch,
        setSearchInput,

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
        <div>
            <h2>
                Applications
            </h2>
            
            <div className="layout">

                <ApplicationForm addApplication = {addApplication}/>

                <input
                        value={searchInput}
                        onChange={(e) => 
                            {
                                setSearchInput(e.target.value)
                                // setPage(1)
                            }
                        }
                        placeholder="Search name..."
                    />
            
                <div>
                    <ApplicationList 
                    applications={applications}
                    deleteApplication={deleteApplication}
                    updateApplication={updateApplication}    
                    />

                    <div className="pagination">

                    <button disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}>
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button disabled={page === totalPages}
                            onClick={() => setPage(prev => prev + 1)}>
                        Next
                    </button>

                    </div>
                </div>
                
                
            </div>
        </div>
    )

}

export default CreditPage

