import {useState} from "react"


function ApplicationSearch(
     {
        nameInput,
        setNameInput,

        risk,
        setRisk,

        loanStatus,
        setLoanStatus,

        decision,
        setDecision
    } 
) {

        return(
            <div>

                <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                />

                <select
                    value={risk}
                    onChange={(e) => setRisk(e.target.value)}
                >
                    
                    <option value="">All Risks</option>
                    <option value="Low Risk">Low Risk</option>
                    <option value="High Risk">High Risk</option>
                </select>

                <select
                    value={loanStatus}
                    onChange={(e) => setLoanStatus(e.target.value)}
                >
                    <option value="">Select Status</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                </select>

                <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                >
                    <option value="">Possible Decisions</option>
                    <option value="Reject">Reject</option>
                    <option value="Approve">Approve</option>
                </select>

            </div>
            )

}

export default ApplicationSearch 