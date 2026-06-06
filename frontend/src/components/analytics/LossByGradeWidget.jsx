import React from "react";

function LossByGradeWidget({ data }) {
    return (
        <div className="analytics-card">
            <div className="card-header">
                <h3>
                    Expected Loss
                    <span className="badge">By Loan Grade</span> 
                </h3>
            </div>

            {(!data || data.length === 0) ? (
                <div>
                    No Data for this Analytic
                </div>
            ) : (
                <div className="stat-list">
                    {data.map((item, index) => {

                        return (
                            <div key={index} className="stat-item">
                                <div className="stat-info">
                                    <div className="stat-title-group">
                                        <span className="stat-name">
                                            Grade {item.loan_grade || "Other"}
                                        </span>

                                        <span className="stat-count">
                                            {item.total_applications} applications
                                        </span>
                                    </div>
                                    <div className="stat-stats">
                                        <span className="stat-amount loss">
                                            Expected loss: {item.average_loss_per_grade}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default LossByGradeWidget;