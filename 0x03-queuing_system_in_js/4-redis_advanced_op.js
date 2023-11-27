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

const keyValue = 'HolbertonSchools';
const values = {'Portland': 50,
                'Seattle': 80,
                'New York': 20,
                'Bogota': 20,
                'Cali': 40,
                'Paris': 2}
for (const [key, val] of Object.entries(values)) {
  redisClient.hset(keyValue, key, val, (error, reply) =>
    redis.print((`Reply: ${reply}`))
  );
}

redisClient.hgetall(keyValue, (error, object) => console.log(object));
