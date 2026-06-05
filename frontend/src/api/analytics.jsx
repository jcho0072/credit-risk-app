const url = `${import.meta.env.VITE_API_URL}`;

async function request(endpoint, options = {}) {
    try {
        const res = await fetch(`${url}${endpoint}`, options)
        let result

        // JSON response 
        try{
            result = await res.json()  // parse json body 
           

        } catch {
            throw new Error("Invalid response format from server")
        }

        // HTTP error
        if (!res.ok) {
            throw new Error(
                result.error?.message || `HTTP ${res.status}`
            )
        }
        return result

    // Handle network error
    } catch (err) {
        throw new Error(err.message || "Network error")
    }
}


export async function getLossByGrade() {
    return request("/analytics/loss-by-grade", {
        method: "GET"
    });
}

export async function getDefaultRateByIntent() {
    return request("/analytics/default-rate-by-intent", {
        method: "GET"
    });
}

export async function getLoanAmountByGrade() {
    return request("/analytics/loan-amount-by-grade", {
        method: "GET"
    });
}