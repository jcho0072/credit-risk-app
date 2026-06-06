import React from "react";

function LoanAmountByGrade ({data}) {
    return (
        <div className="analytics-card">
            <div className="card-header">
                <h3>
                    Loan Amount
                   <span className="badge">By Loan Grade</span> 
                </h3>
            </div>

                {(!data || data.length === 0) ? 

                <div>
                    No Data for this Analytic
                </div> : 
                
                (
                <div className="stat-list">

                    {data.map((item,index) => {
                        return 
                        (<div key={index} className="stat-item">
                            <div className="stat-info">
                                <div className="stat-title-group">
                                    <span className="stat-name">
                                        {item.loan_grade || "Other"}
                                    </span>

                                     <span className="stat-count">
                                        {item.total_applications} applications
                                    </span>
                                </div>
                                <div className="stat-stats">
                                    <span className="stat-amount">
                                        Average loan amount: {item.average_loan_amount}
                                    </span>
                                </div>
                            </div>
                        </div>)
                    })}

                </div>)}
            
        </div>
    )
}

export default LoanAmountByGrade;