'use strict';

require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');
const http = require('http').Server(app);
const version = require('./package.json').version;
const io = require('socket.io')(http);
const morgan = require('morgan');

const {
  PORT: serverPort = 9200,
  HOST: serverHost = 'localhost',
  NODE_ENV: serverEnv = 'dev',
  REDIS_HOST: serverRedisHost = 'localhost:6379'
} = process.env;

/**
 * Create Redis connection
 */
const redisClient = redis.createClient(serverRedisHost);
app.redis = redisClient;

/**
 * Checking redis connection on startup
 */
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', () => {
  console.log('Cannot connect to Redis');
});

app.get('/*', function ( req, res ) {
  res
    .status( 200 )
    .set({ 'content-type': 'text/html; charset=utf-8' })
    .sendFile( __dirname + '/public/index.html' )
});

/**
 * Allow CORS
 */
app.use(cors());
/**
 * Add Bodyparser
 */
app.use(bodyParser.json());
/**
 * Health endpoint
 */
app.get('/api/health', (req, res) => {
  res
    .status(200)
    .json({
      version: version
    });
});

/**
 * Socket.io
 */
app.io = io;

app.redis.on('message', (channel, message) => {
  console.log(channel, message);
  io.sockets.emit({message});
});

app.redis.subscribe('general');

/**
 * Adding logger for dev
 */
if (serverEnv !== 'production') {
  app.use(morgan('dev'));
}

/**
 * Add routes
 */
app.use('/api', require('./server/routes/redis')(app, express));


/**
 * Start the server
 */
http.listen(serverPort, serverHost, function(){
  console.log(`Server started at the address ${serverHost}:${serverPort}`);
})

module.exports = app;