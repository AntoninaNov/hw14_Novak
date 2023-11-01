const http = require('http');
const url = require('url');

// Mock user data
let userData = [
    { id: '1001', firstName: 'Alice', lastName: 'Williams', status: 'online', connections: ['1002', '1003'] },
    { id: '1002', firstName: 'Bob', lastName: 'Johnson', status: 'offline', connections: ['1001', '1004'] },
    { id: '1003', firstName: 'Charlie', lastName: 'Brown', status: 'online', connections: ['1001'] },
    { id: '1004', firstName: 'David', lastName: 'Smith', status: 'offline', connections: ['1002'] },
    { id: '1005', firstName: 'Emily', lastName: 'Davis', status: 'online', connections: ['1001'] },
];

// Create HTTP server
const httpServer = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const { pathname, query } = parsedUrl;

    // GET methods
    if (request.method === 'GET') {
        if (pathname === '/fetchAllUsers') {
            response.end(JSON.stringify(userData));
        } else if (pathname === '/fetchUserById') {
            const singleUser = userData.find(u => u.id === query.id);
            response.end(JSON.stringify(singleUser));
        }
    }
    // POST methods
    else if (request.method === 'POST') {
        if (pathname === '/createNewUser') {
            let payload = '';
            request.on('data', chunk => {
                payload += chunk.toString();
            });
            request.on('end', () => {
                const newUser = JSON.parse(payload);
                userData.push(newUser);
                response.end(JSON.stringify(newUser));
            });
        }
    }
    // PUT methods
    else if (request.method === 'PUT') {
        if (pathname === '/modifyUser') {
            let payload = '';
            request.on('data', chunk => {
                payload += chunk.toString();
            });
            request.on('end', () => {
                const updatedUserData = JSON.parse(payload);
                userData = userData.map(u => u.id === updatedUserData.id ? updatedUserData : u);
                response.end(JSON.stringify(updatedUserData));
            });
        }
    }
    // DELETE methods
    else if (request.method === 'DELETE') {
        if (pathname === '/removeUser') {
            const userId = query.id;
            userData = userData.filter(u => u.id !== userId);
            userData.forEach(u => {
                if (u.connections) {
                    u.connections = u.connections.filter(connId => connId !== userId);
                }
            });
            response.end(`User with ID ${userId} has been removed`);
        }
    }
});

// Start the server on port 3000
httpServer.listen(3000, () => console.log('[SERVER] HTTP Server is running on port 3000'));

const executeApiTest = (options, requestData, message) => {
    const req = http.request(options, (response) => {
        response.on('data', () => {});
        response.on('end', () => console.log(`[TEST] ${message} - Status: ${response.statusCode}`));
    });
    if (requestData) {
        req.write(requestData);
    }
    req.end();
};

const executeApiTests = () => {
    const apiBaseUrl = {
        hostname: 'localhost',
        port: 3000,
    };

    // GET Tests
    executeApiTest({ ...apiBaseUrl, path: '/fetchAllUsers', method: 'GET' }, null, 'Fetch All Users');
    executeApiTest({ ...apiBaseUrl, path: '/fetchUserById?id=1001', method: 'GET' }, null, 'Fetch User By ID');

    // POST Test
    const newUser = JSON.stringify({ id: '1006', firstName: 'Test', lastName: 'User' });
    executeApiTest({
        ...apiBaseUrl,
        path: '/createNewUser',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': newUser.length
        }
    }, newUser, 'Create New User');

    // PUT Test
    const updateUser = JSON.stringify({ id: '1006', firstName: 'ModifiedTest' });
    executeApiTest({
        ...apiBaseUrl,
        path: '/modifyUser',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': updateUser.length
        }
    }, updateUser, 'Update User');

    // DELETE Test
    executeApiTest({ ...apiBaseUrl, path: '/removeUser?id=1004', method: 'DELETE' }, null, 'Remove User');
};

// Execute the tests after a short delay
setTimeout(executeApiTests, 1000);
