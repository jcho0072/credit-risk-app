import {useState} from "react"


function ApplicationSearch({
    nameInput,
    setNameInput,
    risk,
    setRisk,
    loanStatus,
    setLoanStatus,
    decision,
    setDecision
}) {
    return (
        <div className="sidebar-card">
            <h3>Search & Filters</h3>
            <div className="search-fields">
                <div className="form-field">
                    <label htmlFor="search-name">Applicant Name</label>
                    <input
                        id="search-name"
                        type="text"
                        placeholder="Type name to search..."
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="filter-risk">Risk Assessment</label>
                    <select
                        id="filter-risk"
                        value={risk}
                        onChange={(e) => setRisk(e.target.value)}
                    >
                        <option value="">All Risks</option>
                        <option value="Low Risk">Low Risk</option>
                        <option value="High Risk">High Risk</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="filter-status">Default Status</label>
                    <select
                        id="filter-status"
                        value={loanStatus}
                        onChange={(e) => setLoanStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="0">0 (Non-default)</option>
                        <option value="1">1 (Default)</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="filter-decision">Decision</label>
                    <select
                        id="filter-decision"
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                    >
                        <option value="">Possible Decisions</option>
                        <option value="Approve">Approve</option>
                        <option value="Reject">Reject</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default ApplicationSearch 