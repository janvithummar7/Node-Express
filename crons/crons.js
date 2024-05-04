var cron = require('node-cron');

function cron1(){
    cron.schedule(' * * * * *', () => {
        console.log('Cron1 running a task every minute');
    });
}

function cron2(){
    cron.schedule('* * * * *', () => {
        console.log('Cron2 running a task every minute');
    });
}

module.exports  = { cron1, cron2}


