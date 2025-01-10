const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
    id: { type: String, required: true }, // e.g., 'bitcoin'
    symbol: String,
    name: { type: String, required: true },
    current_price: { type: Number, required: true },
    market_cap: { type: Number, required: true },
    price_change_percentage_24h: Number,
    createdAt: { type: Date, default: Date.now }  // Track when the record is created
},
    { timestamps: true }
);

module.exports = mongoose.model("Coin", coinSchema);
