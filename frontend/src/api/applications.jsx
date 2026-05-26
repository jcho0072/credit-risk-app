// data access layer
const url = `${import.meta.env.VITE_API_URL}`;



async function request(endpoint, options = {}) {
    try {
        const res = await fetch(`${url}${endpoint}`, options)
        let result

        // JSON response 
        try{
            result = await res.json()
           

        } catch {
            throw new Error("Invalid response format from server")
        }

        // HTTP error
        if (!res.ok) {
            throw new Error(
                result.error?.message || "Request failed"
            )
        }
        return result

    // Handle network error
    } catch (err) {
        throw new Error(err.message || "Network error")
    }
}


export async function getApplications(page, limit, name, risk, loan_status, decision) {
    return request(`/applications?page=${page}&limit=${limit}&name=${name}&risk=${risk}&loan_status=${loan_status}&decision=${decision}`, {
        method: "GET"
    })
}

export async function createApplication(payload) {
    return request("/applications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

}

export async function updateApplication(id, payload) {
    return request(`/applications/${id}`, {
        method: "PUT",
        headers: {
                "Content-Type": "application/json"
            },
        body: JSON.stringify(payload)
    })
}

export async function deleteApplication(id) {
    return request(`/applications/${id}`, {
        method: "DELETE"
    })
}

// export async function deleteAllApplications() {
//     const res = await fetch(`${url}/applications`, {
//         method: "DELETE"
//     })

//     if (!res.ok) throw new Error("failed to delete all applications")
//     return res.json()
// }

