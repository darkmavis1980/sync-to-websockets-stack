'use strict';

require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const version = require('./package.json').version;

const serverPort = process.env.PORT || 9200;
const serverHost = process.env.HOST || 'localhost';

/**
 * Allow CORS
 */
app.use(cors());

app.get('/health', (req, res) => {
  res
    .status(200)
    .json({
      version: version
    });
})

/**
 * Start the server
 */
http.listen(serverPort, serverHost, function(){
  console.log(`Server started at the address ${serverHost}:${serverPort}`);
})

module.exports = app;