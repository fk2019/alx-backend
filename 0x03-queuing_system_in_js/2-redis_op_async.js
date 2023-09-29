import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting Redis key: ${err}`);
    } else {
      redis.print(`Reply: ${reply}`);
    }
  });
};

const getAsync = promisify(client.get).bind(client);
const displaySchoolValue = async (schoolName) => {
  try {
    const value = await getAsync(schoolName);
    if (value === null) {
      console.log(`Redis key "${schoolName}" not found`);
    } else {
      console.log(value);
    }
  } catch (err) {
    console.error(`Error getting Redis key: ${err}`);
  }
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
