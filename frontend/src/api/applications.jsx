// data access layer


const url = `${import.meta.env.VITE_API_URL}`;

export async function getApplications() {
    try {
        const res = await fetch(`${url}/applications`, {
        method: "GET"
    })

    // Handle HTTP errors
    if (!res.ok) 
        {
            let errorMessage = "Failed to fetch applications"

            try{
                const errorData = await res.json()
                errorMessage = errorData.error || errorMessage
            } catch {
                
            }
            throw new Error(errorMessage)
        }
    
    // Handle JSON parsing 
    try {
        return await res.json()
    } catch {
        throw new Error("Invalid response format from server")
    } 

    } catch (err) {
        // Handle network and fetch failures
        throw new Error(err.message || "Network error")
    }
    
    
}

export async function createApplication(payload) {
    const res = await fetch(`${url}/applications`, {
        method: "POST",
        headers: {
                "Content-type": "application/json"
            },
        body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error("failed to create application")
    return res.json() 
}

export async function updateApplication(id, payload) {
     const res = await fetch(`${url}/applications/${id}`, {
        method: "PUT",
        headers: {
                "Content-type": "application/json"
            },
        body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error("failed to update application")
    return res.json() 
}

export async function deleteApplication(id) {
    const res = await fetch(`${url}/applications/${id}`, {
            method:'DELETE' 
        })
    
    if (!res.ok) throw new Error("failed to delete application")
    return res.json() 
    

}

// export async function deleteAllApplications() {
//     const res = await fetch(`${url}/applications`, {
//         method: "DELETE"
//     })

//     if (!res.ok) throw new Error("failed to delete all applications")
//     return res.json()
// }

