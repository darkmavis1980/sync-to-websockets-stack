'use strict';

const bodyParser = require('body-parser');
const redis = require('redis');
const jsonParser = bodyParser.json();

const {
  REDIS_HOST: serverRedisHost = 'localhost:6379'
} = process.env;


module.exports = (app, express) => {
  const router = express.Router();

  router.post('/message', jsonParser, (req, res) => {
    const pub = redis.createClient(serverRedisHost);
    const { message } = req.body;
    pub.publish('general', message);
    res.status(200).json({message}).end();
  });

  return router;
};