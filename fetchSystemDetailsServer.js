const httpModule = require('http');
const operatingSystemModule = require('os');

const fetchSystemDetails = () => ({
    OperatingSystem: operatingSystemModule.type(),
    OSVersion: operatingSystemModule.release(),
    SystemArchitecture: operatingSystemModule.arch(),
    ProcessorInfo: operatingSystemModule.cpus(),
    Is64Bit: operatingSystemModule.arch() === 'x64',
    TotalRAM: operatingSystemModule.totalmem(),
    AvailableRAM: operatingSystemModule.freemem(),
    UserInformation: operatingSystemModule.userInfo()
});

// Initialize HTTP Server
const systemInfoServer = httpModule.createServer((request, response) => {
    if (request.url === '/fetchSystemDetails') {
        const systemInformation = fetchSystemDetails();
        console.log(systemInformation);
        response.end(JSON.stringify(systemInformation));
    }
});

// Start listening on port 3000
systemInfoServer.listen(3000, () => {
    console.log('[SERVER] HTTP Server is running on port 3000');
});

// Perform an HTTP GET request to retrieve the system information
httpModule.get('http://localhost:3000/fetchSystemDetails');
