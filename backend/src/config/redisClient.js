const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

module.exports = redisClient;
