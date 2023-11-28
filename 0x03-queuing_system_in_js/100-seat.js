import { promisify } from 'util';

const express = require('express');

const kue = require('kue');

const redis = require('redis');

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on('error', (error) => {
    console.error(`Redis client not connected to the server : ${error}`);
  });
  redisClient.on('ready', () => {
    console.log('Redis client connected to the server');
  });
})();

const reserveSeat = (number) => {
  redisClient.set('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
  const promiseData = promisify(redisClient.get).bind(redisClient);
  const result = await promiseData('available_seats');
  return result;
};

const que = kue.createQueue();
const app = express();
const port = 1245;

let reservationEnabled;

app.get('/available_seats', async (req, res) => {
  const result = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: result });
});
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  let seats = await getCurrentAvailableSeats();
  seats = parseInt(seats, 10);
  const job = que.create('reserve_seat', { seats }).save((err) => {
    if (!err) {
      res.json({ status: 'Reservation in process' });
      return;
    }
    res.json({ status: 'Reservation failed' });
  });
  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err}`);
  });
});
app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });
  que.process('reserve_seat', async (job, done) => {
    const { seats } = job.data;
    job.data.seats = seats - 1;
    reserveSeat(job.data.seats);
    if (job.data.seats >= 0) {
      if (job.data.seats === 0) reservationEnabled = false;
      done();
    }
    done(new Error('Not enough seats available'));
  });
});
app.listen(port, () => {
  reservationEnabled = true;
  reserveSeat(50);
  console.log(`Listening on port ${port}`);
});
