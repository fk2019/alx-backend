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

const setNewSchool = (schoolName, value) => {
  redisClient.set(schoolName, value, (err, reply) => {
    redis.print(`Reply: ${reply}`);
  });
};
const displaySchoolValue = (schoolName) => {
  redisClient.get(schoolName, (err, reply) => console.log(reply));
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
