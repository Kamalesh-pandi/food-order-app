const http = require('http');

const checkUrl = (path) => {
    const options = {
        hostname: '16.171.10.128',
        port: 8081,
        path: path,
        method: 'HEAD',
        timeout: 5000
    };

    const req = http.request(options, (res) => {
        console.log(`${path}: Status ${res.statusCode}`);
    });

    req.on('error', (e) => {
        console.log(`${path}: Error ${e.message}`);
    });

    req.end();
};

checkUrl('/api/categories');
checkUrl('/categories');
