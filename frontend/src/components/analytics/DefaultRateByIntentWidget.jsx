import React from "react";

function DefaultRateByIntentWidget({ data }) {

    // Helper to format probability (e.g. 0.1567 -> 15.7%)
    const formatProbability = (prob) => {
        if (prob === undefined || prob == null) return "0.00%";

        const percentage = prob <= 1 ? prob*100 : prob
        return `${percentage.toFixed(1)}%`;
    }

    // // Helper to get color code based on default risk level
    // const getRiskColor = (prob) => {
    //     const value = prob <= 1 ? prob * 100 : prob;
    //     if (value < 10) return "var(--success, #22c55e)"; // Safe / Low Risk
    //     if (value < 20) return "var(--warning, #f59e0b)"; // Moderate Risk
    //     return "var(--danger, #ef4444)"; // High Risk
    // };

    return (
        <div className="analytics-card">
            <div className="card-header">
                <h3>
                    Default Rate
                    <span className="badge">By Intent Category</span>
                </h3>

                {(!data || data.length === 0 ? 
                    <div>
                        No data available for this analytic
                    </div>: (
                        <div className="intent-list">
                            {data.map((item,index) => {
                                 
                                 const riskPercent = probValue <= 1 ? probValue * 100 : probValue;

                                 return (
                                    <div key={index} className="intent-item">
                                        <div className="intent-info">
                                            <div className="intent-title-group">
                                                <span className="intent-name">
                                                    {item.loan_intent || "Other"}
                                                </span>
                                                <span>
                                                    {item.total_applications} applications
                                                </span>
                                            </div>
                                            <div className="intent-stats">
                                                <span className="intent-amount">
                                                    {item.average_loan_amount}
                                                </span>

                                                <span className="intent-rate">
                                                    Average loan amount:{formatProbability(item.average_loan_amount)}
                                                </span>

                                            </div>
                                        </div>

                                         {/* Visual Progress Bar for Default Risk */}
                                         <div className="progress-bar-bg">
                                            <div className="progress-bar-fill">
                                                style={{
                                                    width: `${Math.min(riskPercent, 100)}%`,
                                                    
                                                }}

                                            </div>

                                         </div>

                                    </div>
                                 )
                            })}

                        </div>
                    )
                )}

            </div>

        </div>
    )


}

export default DefaultRateByIntentWidget;