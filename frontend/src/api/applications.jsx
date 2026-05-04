// data access layer


const url = `${import.meta.env.VITE_API_URL}`;

export async function getApplications() {
    const res = await fetch(`${url}/applications`, {
        method: "GET"
    })
    if (!res.ok) throw new Error("failed to fetch applications")
    return res.json()
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

