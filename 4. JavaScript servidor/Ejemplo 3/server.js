const http = require('http');

const PORT = 8080;
const IP = '52.20.170.244';

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('I am Groot\n');
});

server.listen(PORT, () => {
    console.log(`Server running at http://${IP}:${PORT}/`);
});