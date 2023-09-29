import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});

// create hash
const createHash = () => {
  client.hset('HolbertonSchools', 'Portland', 50, redis.print);
  client.hset('HolbertonSchools', 'Seattle', 80, redis.print);
  client.hset('HolbertonSchools', 'New York', 20, redis.print);
  client.hset('HolbertonSchools', 'Bogota', 20, redis.print);
  client.hset('HolbertonSchools', 'Cali', 40, redis.print);
  client.hset('HolbertonSchools', 'Paris', 2, redis.print);
};

// Display the hash
const displayHash = () => {
  client.hgetall('HolbertonSchools', (err, result) => {
    if (err) {
      console.error(`Error getting hash from Redis: ${err}`);
    } else {
      console.log(result);
    }
    // Close the Redis client
    client.quit();
  });
};

// Call the createHash function to store the hash
createHash();

// Call the displayHash function to retrieve and display the hash
setTimeout(displayHash, 10); // Add a delay to ensure the hash is created first
