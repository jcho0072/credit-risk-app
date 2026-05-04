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
    try {
        const res = await fetch(`${url}/applications`, {
        method: "POST",
        headers: {
                "Content-type": "application/json"
            },
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        let errorMessage = "Failed to create application"
        
        try {
            const errorData = await res.json()
            errorMessage = errorData.error || errorMessage 
        } catch {

        }  
        throw new Error(errorMessage)

    } // Handle JSON parsing
     try {
        // network successful  
        return await res.json()
    } catch {
        throw new Error("Invalid response format from server") }


    } catch (err){
        // Handle network and fetch failures
        throw new Error(err.message || "Network error")
    }

}

export async function updateApplication(id, payload) {
    try {
        const res = await fetch(`${url}/applications/${id}`, {
        method: "PUT",
        headers: {
                "Content-type": "application/json"
            },
        body: JSON.stringify(payload)
    })

     if (!res.ok) {
        let errorMessage = "Failed to update application"
        try {
            const errorData = await res.json()
            errorMessage = errorData.error || errorMessage
        } catch {

        } 
        throw new Error(errorMessage)


        try { // Handle JSON parsing
             return await res.json()
        } catch {
            throw new Error("Invalid response format from server")
        }

     }

    } catch (err){
        // Handle network and fetch failures
        throw new Error(err.message || "Network error")

    }  
}

export async function deleteApplication(id) {
    try {
        const res = await fetch(`${url}/applications/${id}`, {
            method:'DELETE' 
        })
    if (!res.ok) {
            let errorMessage = "Failed to delete application"
            try{
                const errorData = await res.json()
                errorMessage = errorData.error || errorMessage
            } catch {

            }
            throw new Error(errorMessage)   
        
    
    try{
            // Handle JSON 
            return await res.json()
        } catch {
            throw new Error("Invalid response format from server")
            }
        } 
    }

    catch (err) {
        // Handle network and fetch failures
        throw new Error(err.message || "Network error")
    }
    
    

}

// export async function deleteAllApplications() {
//     const res = await fetch(`${url}/applications`, {
//         method: "DELETE"
//     })

//     if (!res.ok) throw new Error("failed to delete all applications")
//     return res.json()
// }

