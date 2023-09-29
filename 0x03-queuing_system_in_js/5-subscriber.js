import redis from 'redis';

const subscriberClient = redis.createClient();

subscriberClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

subscriberClient.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});

subscriberClient.subscribe('holberton school channel');

subscriberClient.on('message', (channel, message) => {
  console.log(message);

  // Check if the message is "KILL_SERVER" and unsubscribe/quit
  if (message === 'KILL_SERVER') {
    subscriberClient.unsubscribe('holberton school channel');
    subscriberClient.quit();
  }
});
