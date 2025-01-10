const axios = require("axios");
const Coin = require('../models/Coin');

const BASE_URL = "https://api.coingecko.com/api/v3";

// Fetch cryptocurrency details
async function fetchCryptoDetails() {
    const axios = require("axios");

    // CoinGecko API base URL
    const url = "https://api.coingecko.com/api/v3/simple/price";

    // List of coins to fetch data for
    const coins = [
        { id: "bitcoin", symbol: "btc" },
        { id: "matic-network", symbol: "matic" },
        { id: "ethereum", symbol: "eth" }
    ];

    for (let coin of coins) {
        try {
            // Fetch the current price, market cap, and price change for each coin
            const response = await axios.get(url, {
                params: {
                    ids: coins.map(coin => coin.id).join(","),
                    vs_currencies: "usd",
                    include_market_cap: "true",
                    include_24hr_change: "true"
                }
            });

            // Prepare data to store in the database
            for (let coin of coins) {
                const data = response.data[coin.id];

                // Prepare data to store in the database
                const newCoinData = {
                    id: coin.id,
                    symbol: coin.symbol,  // Extract symbol based on CoinGecko ID
                    name: coin.id.charAt(0).toUpperCase() + coin.id.slice(1),
                    current_price: data.usd,
                    market_cap: data.usd_market_cap,
                    price_change_percentage_24h: data.usd_24h_change,
                    createdAt: new Date()
                };

            // Insert the new coin data without overwriting existing records
            await Coin.create(newCoinData);  // This will insert new records without overwriting

            console.log(`Data for ${coin.id} fetched and stored successfully!`);
            }
            await delay(5000);
        } catch (error) {
            console.error(`Error fetching data for ${coin.id}:`, error.message);
        }
    }
}

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
