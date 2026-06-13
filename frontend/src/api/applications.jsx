// data access layer
const url = `${import.meta.env.VITE_API_URL}`;


async function request(endpoint, options = {}) {
        
    // Set Default Header type
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'Application/json' 
        }

        // Merge headers and global options config safely
        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
        }

        
        // Remove content-type if payload is FormData
        if (config.body instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        const contentType = config.headers['Content-Type'] || '';

        // Payload serialization: JSON, FormData, URLSearchParams
        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
            if (contentType.includes('application/json')) {
                config.body = JSON.stringify(config.body);
            } else if (contentType.includes('application/x-www-form-urlencoded')) {
                config.body = new URLSearchParams(config.body).toString();
            }
        }

        try{
            const res = await fetch(`${url}${endpoint}`, config)

            // Graceful Response Handling: Check for content before parsing
            const isJson = res.headers.get('content-type')?.includes('application/json');
            const result = isJson ? await res.json() : null;

            // HTTP error handling
            if (!res.ok) {
                throw new Error(result?.error?.message || result?.message || `HTTP error! status:${res.status}`)
            }

            return result;
        }

        catch(err){
            // Intercept server exceptions and network problems
            throw new Error(err.message || "Network error occurred.");

    }
}



export async function getApplications(filters = {}) {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([_, val]) => val !== undefined && val !== ''))).toString()

    return request(`applications?${params}`, {
        method: "GET"
    })
}

export const createApplication = (payload) =>  
    request("/applications", {
        method: "POST",
        body: payload
    })



export const updateApplication = (application_id, payload) =>
    request(`/applications/${application_id}`, {
        method: "PUT",
        body:payload
    })


export const deleteApplication = (application_id) => 
    request(`/applications/${application_id}`, {
        method: "DELETE"
    })


// export async function deleteAllApplications() {
//     const res = await fetch(`${url}/applications`, {
//         method: "DELETE"
//     })

//     if (!res.ok) throw new Error("failed to delete all applications")
//     return res.json()
// }

