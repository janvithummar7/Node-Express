 
    function functionName() {
      cron.schedule('/10 * * * ', () => {
        console.log('Crons is running');
      });
    }

    module.exports = {functionName}
  