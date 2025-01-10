const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
    id: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    current_price: { type: Number, required: true },
    market_cap: { type: Number, required: true },
    price_change_percentage_24h: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Coin = mongoose.model("Coin", coinSchema);

module.exports = Coin;
