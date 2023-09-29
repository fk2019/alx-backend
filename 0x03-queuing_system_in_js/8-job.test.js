const kue = require('kue');
const { expect } = require('chai');
const createPushNotificationsJobs = require('./8-job');

describe('createPushNotificationsJobs', () => {
  let queue;

  before(() => {
    // Initialize the Kue queue and enter test mode
    queue = kue.createQueue(
      { redis: { port: 6379, host: '127.0.0.1' }, testMode: true });
  });

  after(() => {
    // Clear the queue and exit test mode after tests are done
    queue.testMode.exit();
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
  });

  it('should create jobs in the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Check if jobs are added to the queue
    expect(queue.testMode.jobs.length).to.equal(jobs.length);

    // Validate the job types and data
    const jobTypes = jobs.map((job) => 'push_notification_code_3');
    const jobData = jobs.map((job) => job);

    const queueJobTypes = queue.testMode.jobs.map((job) => job.type);
    const queueJobData = queue.testMode.jobs.map((job) => job.data);

    expect(queueJobTypes).to.deep.equal(jobTypes);
    expect(queueJobData).to.deep.equal(jobData);
  });
});
