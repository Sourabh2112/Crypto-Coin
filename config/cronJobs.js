const cron = require("node-cron");
const { fetchCryptoDetails } = require("../controllers/coinController");

// Schedule the job to run every 2 hours
const startCronJobs = () => {
    cron.schedule("0 */2 * * *", async () => {
        console.log("Running background job: Fetching crypto details...");
        await fetchCryptoDetails();
    });
};

module.exports = startCronJobs;
