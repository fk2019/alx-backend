const kue = require('kue');

const queue = kue.createQueue();

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  },
];

const queueName = 'push_notification_code_2';

jobs.forEach((jobData) => {
  const job = queue
    .create(queueName, jobData)
    .save((err) => {
      if (!err) {
        console.log(`Notification job created: ${job.id}`);
      } else {
        console.error(`Error creating notification job: ${err}`);
      }
    });

  // Handle job completion
  job.on('complete', () => {
    console.log(`Notification job ${job.id} completed`);
  });

  // Handle job failure
  job.on('failed', (err) => {
    console.error(`Notification job ${job.id} failed: ${err}`);
  });

  // Handle job progress (e.g., percentage complete)
  job.on('progress', (progress) => {
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });
});

// Handle errors during job processing
queue.on('error', (err) => {
  console.error('Queue error:', err);
});
