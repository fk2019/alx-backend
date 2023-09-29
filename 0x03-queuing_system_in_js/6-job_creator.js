const kue = require('kue');

const queue = kue.createQueue();

const jobData = {
  phoneNumber: '1234567890',
  message: 'This is the code to verify your account',
};

const job = queue
  .create('push_notification_code', jobData)
  .save((err) => {
    if (!err) {
      console.log(`Notification job created: ${job.id}`);
    } else {
      console.error('Error creating notification job:', err);
    }
  });

// Handle job completion
job.on('complete', () => {
  console.log('Notification job completed');
  process.exit(0);
});

// Handle job failure
job.on('failed', (err) => {
  console.error('Notification job failed:', err);
  process.exit(1);
});
