const http = require('http');
const { reslove } = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.Server(app);

app.get('/', (req, res) => res.sendfile(reslove(__dirname, './index.html')));
server.listen(PORT, () => console.log([`listening on port ${PORT}`]));