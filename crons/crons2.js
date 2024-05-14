 
  var cron = require('node-cron');
    cron.schedule('* * * * * * ', () => {
        console.log("Crons2 is running");
    });
    
  module.exports = {cron}
  