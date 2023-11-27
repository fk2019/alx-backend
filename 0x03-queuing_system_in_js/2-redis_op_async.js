import redis from 'redis';
import { createClient } from 'redis';
import { promisify } from 'util';


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

const displaySchoolValue = async (schoolName) => {
  const promiseData = promisify(redisClient.get).bind(redisClient)
  const reply = await promiseData(schoolName);
  console.log(reply);
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
