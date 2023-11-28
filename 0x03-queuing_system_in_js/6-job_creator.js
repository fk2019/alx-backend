const kue = require('kue');

const que = kue.createQueue();

const queData  = {
  phoneNumber: '1234567',
  message: 'hey, how are you?',
};

const job = que.create('push_notification_code', queData)
            .save(function(err){
                if (!err) console.log(`Notification job created: ${job.id}`);
            });

job.on('complete', () => console.log('Notification job completed'));
job.on('failed', () => console.log('Notification job failed'));
