const axios = require("axios");
const Coin = require('../models/Coin');

const BASE_URL = "https://api.coingecko.com/api/v3";

// Fetch cryptocurrency details
const fetchCryptoDetails = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/simple/price`, {
            params: {
                ids: "bitcoin,ethereum,matic-network",
                vs_currencies: "usd",
                include_market_cap: true,
                include_24hr_change: true,
            },
        });

        const coinsData = response.data;

        const coinsToSave = Object.keys(coinsData).map((id) => ({
            id,
            symbol: id === "matic-network" ? "matic" : id,
            name: id.charAt(0).toUpperCase() + id.slice(1),
            current_price: coinsData[id].usd,
            market_cap: coinsData[id].usd_market_cap,
            price_change_percentage_24h: coinsData[id].usd_24h_change,
        }));

        // Save to the database
        for (const coin of coinsToSave) {
            await Coin.findOneAndUpdate({ id: coin.id }, coin, { upsert: true, new: true });
        }

        console.log("Crypto details fetched and stored successfully!");
    } catch (error) {
        console.error("Error fetching crypto details:", error.message);
    }
};

/**
 * Function to calculate the standard deviation of an array of numbers.
 * @param {Array} values - Array of numbers (prices).
 * @returns {number} - Standard deviation of the prices.
 */
function calculateStandardDeviation(values) {
    const n = values.length;
    if (n === 0) return 0;

    // Calculate the mean
    const mean = values.reduce((acc, val) => acc + val, 0) / n;

    // Calculate the squared differences from the mean
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));

    // Calculate the variance
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / n;

    // Return the standard deviation (sqrt of variance)
    return Math.sqrt(variance);
}

module.exports = { fetchCryptoDetails, calculateStandardDeviation };
