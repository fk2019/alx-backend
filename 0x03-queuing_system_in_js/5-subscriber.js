import redis from 'redis';
import { createClient } from 'redis';

let redisClient;

(async () => {
  redisClient = createClient();

  redisClient.on('error', (error) => {
    console.error(`Redis client not connected to the server : ${error}`)});
  redisClient.on('ready', () => {
    console.log('Redis client connected to the server')})
 })();

redisClient.subscribe('holberton school channel');
redisClient.on('message', (channel, message) => {
    console.log(message);
    if (message === 'KILL_SERVER') {
      redisClient.unsubscribe(channel);
      process.exit(0);
    };
});
