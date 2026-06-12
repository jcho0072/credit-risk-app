// data access layer
const url = `${import.meta.env.VITE_API_URL}`;


async function request(endpoint, options = {}) {
    try {
        // Headers
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'Application/json' 
        }

        // Merge headers and global options config safely
        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        }

        const contentType = config.headers['Content-Type'] || '';


        // Payload serialization
        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
            if (contentType.includes('application/json')) {
                config.body = JSON.stringify(config.body);
            } else if (contentType.includes('application/x-www-form-urlencoded')) {
                config.body = new URLSearchParams(config.body).toString();
            }
        }

        try{
            const res = await fetch(`${url}${endpoint}`, options)

            // Graceful Response Handling: Check for content before parsing
            const isJson = res.headers.get('content-type')?.includes('application/json');
            const result = isJson ? await res.json() : null;

            if (!res.ok) {
                throw new Error(result?.error?.message || result?.message || `HTTP ${res.status}`)
            }
        }

        catch(err){
            // Intercept server exceptions and network problems
            throw new Error(err.message || "Network error occurred.");

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

export async function updateApplication(application_id, payload) {
    return request(`/applications/${application_id}`, {
        method: "PUT",
        headers: {
                "Content-Type": "application/json"
            },
        body: JSON.stringify(payload)
    })
}

export async function deleteApplication(application_id) {
    return request(`/applications/${application_id}`, {
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

