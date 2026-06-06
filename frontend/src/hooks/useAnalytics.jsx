import {useState, useEffect} from "react"

import {getLossByGrade,
        getDefaultRateByIntent,
        getLoanAmountByGrade,   
} from "../api/analytics"


export function useAnalytics() {
    const [analyticsData, setAnalyticsData] = useState({
        lossByGrade: [],
        defaultRateByIntent: [],
        loanAmountByGrade: []
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    function mapErrorToMessage(err) {
        return err || err.message ? err.message : "Something went wrong loading analytics data."
    }

    async function loadAnalyticsData() {
        setLoading(true)
        setError(null)

        try {
            const [lossRes, defaultRes, loanRes] = await Promise.all([
                getLossByGrade(),
                getDefaultRateByIntent(),
                getLoanAmountByGrade()
            ])

            setAnalyticsData({
                lossByGrade: lossRes.data || [],
                defaultRateByIntent: defaultRes.data || [],
                loanAmountByGrade: loanRes.data || []
            })
        } catch (err) {
            const userMessage = mapErrorToMessage(err)  
            setError(userMessage)
        } finally  {
        setLoading(false)
        }   
    }

    useEffect(() => {
        loadAnalyticsData()
    }, [])

    return {
        analyticsData,
        refreshAnalytics:loadAnalyticsData,

        loading,
        error

    }

}


