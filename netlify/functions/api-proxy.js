exports.handler = async (event, context) => {
    // 1. Get the path relative to /api/
    // The trigger path is /api/* -> /.netlify/functions/api-proxy
    const path = event.path.replace(/^\/\.netlify\/functions\/api-proxy/, '').replace(/^\/api/, '');
    const targetUrl = `http://16.171.10.128:8081/api${path}`;

    console.log(`[Proxy] ${event.httpMethod} ${targetUrl}`);

    try {
        // 2. Prepare headers
        const headers = { ...event.headers };
        // Remove headers that might confuse the backend or are managed by fetch
        delete headers.host;
        delete headers['content-length'];
        // Spoof Origin/Referer to satisfy backend CORS
        headers['Origin'] = 'http://16.171.10.128:8081';
        headers['Referer'] = 'http://16.171.10.128:8081/';

        // 3. Forward the request
        const response = await fetch(targetUrl, {
            method: event.httpMethod,
            headers: headers,
            body: event.body ? event.body : undefined,
        });

        // 4. Get response data
        const data = await response.text();

        // 5. Return response to frontend
        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers.get('content-type') || 'application/json',
                'Access-Control-Allow-Origin': '*', // CORS for the frontend
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
