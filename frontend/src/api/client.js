const url = `${import.meta.env.VITE_API_URL}`;

export async function request(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
    };

    // 1. Merge headers and options safely
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    // Remove Content-Type if payload is FormData (browser automatically handles boundaries)
    if (config.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    // 2. Payload serialization
    const contentType = config.headers['Content-Type'] || '';
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        if (contentType.includes('application/json')) {
            config.body = JSON.stringify(config.body);
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            config.body = new URLSearchParams(config.body).toString();
        }
    }

    try {
        // 3. Execute fetch with the fully merged config
        const res = await fetch(`${url}${endpoint}`, config);

        // 4. Graceful Response Handling: Check for JSON content safely
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const result = isJson ? await res.json() : null;

        // 5. HTTP error handling
        if (!res.ok) {
            throw new Error(result?.error?.message || result?.message || `HTTP error! status: ${res.status}`);
        }

        return result;

    } catch (err) {
        // 6. Network errors / custom server exception interception
        throw new Error(err.message || "Network error occurred.");
    }
}
