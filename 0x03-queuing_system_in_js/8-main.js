import kue from 'kue';

import createPushNotificationsJobs from './8-job.js';

const queue = kue.createQueue();

const jobs = [
  { phoneNumber: '1234567890', message: 'This is the code 57545 to verify your account' },
  { phoneNumber: '9876543210', message: 'This is the code 95354 to verify your account ' },
];

createPushNotificationsJobs(jobs, queue);
