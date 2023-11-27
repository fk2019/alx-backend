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

const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    redisClient.publish('holberton school channel', message);
  }, time);
};

publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
