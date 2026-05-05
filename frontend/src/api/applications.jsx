// data access layer


const url = `${import.meta.env.VITE_API_URL}`;



async function request(endpoint, options = {}) {
    try {
        const res = await fetch(`${url}${endpoint}`, options)

        // Handle HTTP errors
        if (!res.ok) {
            let errorMessage = "Request failed"
            try {
                const errorData = await res.json()
                errorMessage = errorData.error || errorMessage
            } catch {}
            throw new Error(errorMessage)
        }

        // Handle JSON parsing
        try {
            return await res.json()
        } catch {
            throw new Error("Invalid response format from server")
        }

    // Handle network error
    } catch (err) {
        throw new Error(err.message || "Network error")
    }
}


export async function getApplications() {
    return request("/applications", {
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

