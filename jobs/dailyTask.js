const cron = require("node-cron");

cron.schedule("* * * * *", () => {
    console.log("Background task executed:", new Date().toLocaleString());
});

console.log("Background task scheduler started.");