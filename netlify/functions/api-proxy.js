exports.handler = async (event, context) => {
    // Handle Preflight OPTIONS request locally
    // This bypasses the backend entirely for CORS checks
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    // 1. Get the path relative to /api/
    const path = event.path.replace(/^\/\.netlify\/functions\/api-proxy/, '').replace(/^\/api/, '');
    const targetUrl = `http://16.171.10.128:8081/api${path}`;

    console.log(`[Proxy] ${event.httpMethod} ${targetUrl}`);

    try {
        // 2. Prepare headers
        const headers = { ...event.headers };

        // CRITICAL FIX: Remove Origin and Referer headers entirely.
        // Making the request look like a direct server-to-server call (like Postman/Curl) 
        // usually bypasses strict CORS validation on the backend.
        delete headers.origin;
        delete headers.referer;
        delete headers.host;
        delete headers['content-length'];

        // 3. Forward the request
        const response = await fetch(targetUrl, {
            method: event.httpMethod,
            headers: headers,
            body: event.body ? event.body : undefined,
        });

        // 4. Get response data
        const data = await response.text();

        // 5. Return response to frontend with proper CORS headers
        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers.get('content-type') || 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins (browser is happy)
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: data,
        };
    } catch (error) {
        console.error("[Proxy Error]", error);
        return {
            statusCode: 502,
            body: JSON.stringify({ error: "Bad Gateway", details: error.message }),
        };
    }
};
