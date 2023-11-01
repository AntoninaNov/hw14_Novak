const fileSystem = require('fs');
const webServer = require('http');

// Function to get current time
const getCurrentTime = () => Date.now();

// Function to log time difference
const logTimeDifference = (startTime, label) => {
    const endTime = getCurrentTime();
    console.log(`${label} completed in ${endTime - startTime}ms`);
};

// Synchronously reads a file
const fetchFileContentSync = () => {
    const startTime = getCurrentTime();
    const content = fileSystem.readFileSync('words.txt', 'utf8');
    logTimeDifference(startTime, 'Synchronous read');
    return content;
};

// Asynchronously reads a file
const fetchFileContentAsync = (callback) => {
    const startTime = getCurrentTime();
    fileSystem.readFile('words.txt', 'utf8', (error, content) => {
        if (error) {
            console.error("An error occurred:", error);
            return;
        }
        logTimeDifference(startTime, 'Asynchronous read');
        callback(content);
    });
};

// HTTP Server
const httpServer = webServer.createServer((request, response) => {
    if (request.url === '/getSync') {
        const data = fetchFileContentSync();
        response.end(data);
    } else if (request.url === '/getAsync') {
        fetchFileContentAsync((data) => {
            response.end(data);
        });
    }
});

httpServer.listen(3000, () => {
    console.log('[SERVER] HTTP Server is running on port 3000');
});

// HTTP Requests
webServer.get('http://localhost:3000/getSync', (res) => {
    res.on('data', (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
    });
});

webServer.get('http://localhost:3000/getAsync', (res) => {
    res.on('data', (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
    });
});
