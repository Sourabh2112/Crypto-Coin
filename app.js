const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const coinRoutes = require("./routes/coinRoutes");
const startCronJobs = require("./config/cronJobs");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api", coinRoutes);
app.get('/', (req, res) => {
    const summary = {
        message: "Welcome to the Crypto API!",
        description: "This API provides the latest data for selected cryptocurrencies (Bitcoin, Ethereum, and Matic). You can fetch current prices, market caps, and 24-hour changes, as well as calculate price deviations.",
        endpoints: {
            "1. /stats": {
                description: "Returns the latest data (current price, market cap, and 24h price change) for a given cryptocurrency.",
                queryParams: {
                    coin: "The cryptocurrency id (bitcoin, ethereum, or matic-network)"
                },
                sampleResponse: {
                    current_price: 40000,
                    marketCap: 800000000,
                    price_change_percentage_24h: 3.4
                }
            },
            "2. /deviation": {
                description: "Returns the standard deviation of the price of a requested cryptocurrency for the last 100 records.",
                queryParams: {
                    coin: "The cryptocurrency id (bitcoin, ethereum, or matic-network)"
                },
                sampleResponse: {
                    deviation: 4082.48
                }
            },
            "3. /fetch": {
                description: "Manually triggers the fetch operation to update the latest cryptocurrency data.",
                sampleResponse: {
                    message: "Data fetch operation triggered successfully."
                }
            },
            
            "4. /coins": {
                description: "Returns all stored cryptocurrency data from the database.",
                sampleResponse: [
                    {
                        id: "bitcoin",
                        symbol: "btc",
                        current_price: 40000,
                        market_cap: 800000000,
                        price_change_percentage_24h: 3.4
                    },
                    {
                        id: "ethereum",
                        symbol: "eth",
                        current_price: 2500,
                        market_cap: 300000000,
                        price_change_percentage_24h: 1.5
                    }
                ]
            }
        }
    };

    res.json(summary); // Respond with the summary
});

// Start cron jobs
startCronJobs();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
