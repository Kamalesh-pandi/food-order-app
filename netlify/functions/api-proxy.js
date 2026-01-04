exports.handler = async (event, context) => {
    // Extract path relative to /api
    // event.path is something like /.netlify/functions/api-proxy/auth/login or /api/auth/login depending on redirect rewrite

    // We want to forward everything after /api/
    const path = event.path.replace(/^\/\.netlify\/functions\/api-proxy/, '').replace(/^\/api/, '');

    const targetUrl = `http://16.171.10.128:8081/api${path}`;

    console.log(`Proxying ${event.httpMethod} request to: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            method: event.httpMethod,
            headers: {
                ...event.headers,
                'Origin': 'http://16.171.10.128:8081',
                'Referer': 'http://16.171.10.128:8081/',
                'Host': '16.171.10.128:8081'
            },
            body: event.body ? event.body : undefined
        });

        const data = await response.text();

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers.get('content-type') || 'application/json',
                'Access-Control-Allow-Origin': '*' // Optional: Allow frontend to see response
            },
            body: data
        };
    } catch (error) {
        console.error("Proxy Error:", error);
        return {
            statusCode: 502,
            body: JSON.stringify({ error: "Bad Gateway", details: error.message })
        };
    }
};
