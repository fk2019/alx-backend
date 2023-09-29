const kue = require('kue');

const queue = kue.createQueue();

const blacklistedNumbers = ['4153518780', '4153518781'];

const sendNotification = (phoneNumber, message, job, done) => {
  job.progress(0, 100);

  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job with an error message
    const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
    job.failed().error(errorMessage);
    done(new Error(errorMessage));
  } else {
    // Update the progress to 50%
    job.progress(50, 100);

    console.log(
      `Sending notification to ${phoneNumber}, with message: ${message}`);

    // Simulate some processing time
    setTimeout(() => {
      // Complete the job
      job.progress(100, 100);
      done();
    }, 2000);
  }
};

// Set the concurrency for the 'push_notification_code_2' queue
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;

  sendNotification(phoneNumber, message, job, done);
});

queue.on('error', (err) => {
  console.error('Queue error:', err);
});
