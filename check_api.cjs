const http = require('http');

const checkPath = (path, method) => {
    const options = {
        hostname: '16.171.10.128',
        port: 8081,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`${method} ${path}: Status ${res.statusCode}`);
    });

    req.on('error', (e) => {
        console.log(`${method} ${path}: Error ${e.message}`);
    });

    req.end();
};

checkPath('/api/auth/login', 'POST');
checkPath('/auth/login', 'POST');
checkPath('/api/users/login', 'POST');
