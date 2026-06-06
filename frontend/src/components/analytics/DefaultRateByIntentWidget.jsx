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
            </div>

            {(!data || data.length === 0) ? (
                <div>
                    No data available for this analytic
                </div>
            ) : (
                <div className="stat-list">
                    {data.map((item,index) => {
                         const probValue = item.average_predicted_probability 
                         const riskPercent = probValue <= 1 ? probValue * 100 : probValue;

                         return (
                            <div key={index} className="stat-item">
                                <div className="stat-info">
                                    <div className="stat-title-group">
                                        <span className="stat-name">
                                            Loan intent: {item.loan_intent || "Other"}
                                        </span>
                                        <span className="stat-count">
                                            {item.total_applications} applications
                                        </span>
                                    </div>
                                    <div className="stat-stats">
                                        <span className="stat-amount">
                                            Average loan amount: {item.average_loan_amount}
                                        </span>

                                        <span className="default-rate">
                                            Default probability:{formatProbability(probValue)}
                                        </span>

                                    </div>
                                </div>

                                 {/* Visual Progress Bar for Default Risk */}
                                 <div className="progress-bar-bg">
                                    <div className="progress-bar-fill"
                                        style={{
                                                width: `${Math.min(riskPercent, 100)}%`,
                                                
                                            }}>
                                
                                    </div>

                                 </div>

                            </div>
                         )
                    })}

                </div>
            )}
        </div>
    )


}

export default DefaultRateByIntentWidget;