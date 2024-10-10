// routes/crypto.js
const express = require("express");
const router = express.Router();
const Crypto = require("../models/cryptoModel");
const { std } = require("mathjs");

// GET /crypto/stats?coin=bitcoin
router.get("/stats", async (req, res) => {
	const { coin } = req.query;
	try {
		const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });
		if (!latestData) {
			return res.status(404).json({ message: "No data found" });
		}
		res.json({
			price: latestData.price,
			marketCap: latestData.marketCap,
			"24hChange": latestData.change24h,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

// GET /crypto/deviation?coin=bitcoin
router.get("/deviation", async (req, res) => {
	const { coin } = req.query;
	try {
		const prices = await Crypto.find({ coin })
			.sort({ timestamp: -1 })
			.limit(10)
			.select("price");

		if (prices.length < 2) {
			return res
				.status(400)
				.json({ message: "Not enough data to calculate deviation" });
		}

		const priceValues = prices.map((p) => p.price);
		const deviation = std(priceValues);

		res.json({ deviation });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
