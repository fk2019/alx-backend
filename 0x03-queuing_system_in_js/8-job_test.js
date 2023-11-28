import createPushNotificationJobs from './8-job';

const kue = require('kue');
const chai = require('chai');

const { expect } = chai;

describe('createPushNotificationJobs', () => {
  const queue = kue.createQueue();
  const jobs = [
    { phoneNumber: '1234567890', message: 'This is the code 57545 to verify your account' },
    { phoneNumber: '1234524564', message: 'This is the code 57358 to verify your account' },
  ];
 
  before(() => {
    queue.testMode.enter();
  });

  afterEach(() => {
    queue.testMode.clear();
  });

  after(() => {
    queue.testMode.exit();
  });
  it('should throw error if jobs is not Array', (done) => {
    expect(() => createPushNotificationJobs({}, queue)).to.throw('Jobs is not an array');
    done();
  });
  it('should create two jobs', () => {
    createPushNotificationJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
    done();
  });
});
