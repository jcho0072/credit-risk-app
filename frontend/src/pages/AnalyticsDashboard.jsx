import {useState, useEffect} from "react"

import {useAnalytics} from "../hooks/useAnalytics"

import LossByGradeWidget from "../components/analytics/LossByGradeWidget"
import DefaultRateByIntentWidget from "../components/analytics/DefaultRateByIntentWidget"
import LoanAmountByGradeWidget from "../components/analytics/LoanAmountByGradeWidget" 
import { getLossByGrade } from "../api/analytics"

function AnalyticsPage () {

    const {
        analyticsData,
        refreshAnalytics,

        loading,
        error
    } = useAnalytics()

    if (loading) {
        return <p>
                Loading analytics ...
            </p>
            }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className="analytics-dashboard">
            <h2>
                Credit Risk Analytics
            </h2>

            <div className = "dashboard-grid"> 
                <LossByGradeWidget data={analyticsData.lossByGrade}/>
                <DefaultRateByIntentWidget data={analyticsData.defaultRateByIntent}/>
                <LoanAmountByGradeWidget data={analyticsData.loanAmountByGrade}/>
            </div>

        </div>
    )

}

export default AnalyticsPage