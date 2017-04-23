const http = require('http');
const { reslove } = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.Server(app);

