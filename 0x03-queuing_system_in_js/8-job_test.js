const kue = require('kue');
const chai = require('chai');

const { expect } = chai;

import createPushNotificationJobs from'./8-job.js';

describe('createPushNotificationJobs', () => {
  const queue = kue.createQueue();

  before(function() {
    queue.testMode.enter();
  });

  afterEach( function() {
    queue.testMode.clear();
  });
  after(function() {
    queue.testMode.exit();
  });
  it('should create 2 new push notification jobs', () => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'This is the code 57545 to verify your account' },
      { phoneNumber: '9876543210', message: 'This is the code 95354 to verify your account ' },
    ];

    createPushNotificationJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(2);

  });
});
