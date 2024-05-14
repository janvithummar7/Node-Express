var cron = require("node-cron");

cron.schedule("* * * * *", () => {
  console.log("\nCron1 running a task every minute");
});

cron.schedule("* * * * hsd*", () => {
  console.log("Cron2 running a task every minute");
});

module.exports = { cron };
