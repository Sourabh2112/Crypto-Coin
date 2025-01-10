const express = require("express");
const { fetchCryptoDetails } = require("../controllers/coinController");
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

module.exports = router;
