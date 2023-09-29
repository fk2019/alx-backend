const kue = require('kue');

const queue = kue.createQueue();

const sendNotification = (phoneNumber, message) => {
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`);
};

// Process jobs from the 'push_notification_code' queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  // Mark the job as completed
  done();
});

// Handle errors during job processing
queue.on('error', (err) => {
  console.error('Queue error:', err);
});
