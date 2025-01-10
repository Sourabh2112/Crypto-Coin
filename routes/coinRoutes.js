const express = require("express");
const { fetchCryptoDetails, calculateStandardDeviation } = require("../controllers/coinController");
const Coin = require("../models/Coin");

const router = express.Router();

/**
 * Route: GET /api/fetch
 * Description: Trigger the background job manually to fetch cryptocurrency data.
 */
router.get("/fetch", async (req, res) => {
    try {
        await fetchCryptoDetails();
        res.status(200).json({ message: "Cryptocurrency data fetched and stored successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cryptocurrency data.", error: error.message });
    }
});

/**
 * Route: GET /api/coins
 * Description: Retrieve all stored cryptocurrency data from the database.
 */
router.get("/coins", async (req, res) => {
    try {
        const coins = await Coin.find();
        res.status(200).json(coins);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving coins from database.", error: error.message });
    }
});

/**
 * Route: GET /api/stats
 * Description: Get the latest stats for the requested cryptocurrency.
 * Query Parameters: coin (e.g., "bitcoin", "ethereum", "matic-network")
 */
router.get("/stats", async (req, res) => {
    const { coin } = req.query;

    if (!coin) {
        return res.status(400).json({ message: "Query parameter 'coin' is required." });
    }

    try {
        // Find the coin details in the database
        const coinData = await Coin.findOne({ id: coin });

        if (!coinData) {
            return res.status(404).json({ message: `Coin data for '${coin}' not found.` });
        }

        // Return the required data
        res.status(200).json({
            current_price: coinData.current_price,
            marketCap: coinData.market_cap,
            price_change_percentage_24h: coinData.price_change_percentage_24h,
        });
    } catch (error) {
        console.error("Error fetching coin stats:", error.message);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
});

/**
 * Route: GET /api/deviation
 * Description: Get the standard deviation of the last 100 prices for the requested cryptocurrency.
 * Query Parameters: coin (e.g., "bitcoin", "ethereum", "matic-network")
 */
router.get("/deviation", async (req, res) => {
    const { coin } = req.query;

    if (!coin) {
        return res.status(400).json({ message: "Query parameter 'coin' is required." });
    }

    try {
        // Fetch the last 100 records of the coin from the database
        const coinData = await Coin.find({ id: coin }).sort({ createdAt: -1 }).limit(100);

        if (coinData.length === 0) {
            return res.status(404).json({ message: `No records found for '${coin}'.` });
        }

        // Extract the prices from the fetched records
        const prices = coinData.map(data => data.current_price);

        // Calculate the standard deviation
        const deviation = calculateStandardDeviation(prices);

        // Return the result
        res.status(200).json({ deviation: deviation });
    } catch (error) {
        console.error("Error calculating standard deviation:", error.message);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
});



module.exports = router;
