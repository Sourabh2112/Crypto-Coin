const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
    id: { type: String, required: true }, // e.g., 'bitcoin'
    symbol: String,
    name: String,
    current_price: Number,
    market_cap: Number,
    price_change_percentage_24h: Number,
    last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Coin", coinSchema);
