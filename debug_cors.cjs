const http = require('http');

const testRequest = (label, headers) => {
    const options = {
        hostname: '16.171.10.128',
        port: 8081,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            ...headers
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log(`[${label}] Status: ${res.statusCode}`);
            if (res.statusCode !== 200 && data.length < 500) {
                console.log(`Body: ${data}`);
            }
            console.log('---');
        });
    });

    req.on('error', (e) => {
        console.log(`[${label}] Error: ${e.message}`);
    });

    // Minimal valid body roughly
    req.write(JSON.stringify({ email: "kamaleshpandi07@gmail.com", password: "password" }));
    req.end();
};

console.log("--- Testing CORS Headers for Login ---");

testRequest('Spoof Localhost Origin', {
    'Origin': 'http://localhost:5173',
    'Referer': 'http://localhost:5173/'
});

testRequest('Spoof Backend IP Origin', {
    'Origin': 'http://16.171.10.128:8081',
    'Host': '16.171.10.128:8081'
});

testRequest('No Origin', {});
