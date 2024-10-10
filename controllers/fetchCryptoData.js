// // cron/fetchCryptoData.js
// const axios = require("axios");
// const Crypto = require("../models/cryptoModel");
// const cron = require("node-cron");


// const COINGECKO_API = process.env.COINGECKO_API;
// const fetchCryptoData = async () => {
// 	try {
// 		const coins = ["bitcoin", "matic-network", "ethereum"];
// 		const apiUrl = `${COINGECKO_API}/simple/price?ids=${coins.join(",")}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

// 		const response = await axios.get(apiUrl);
// 		const data = response.data;

// 		const cryptoEntries = coins.map((coin) => ({
// 			coin,
// 			price: data[coin].usd,
// 			marketCap: data[coin].usd_market_cap,
// 			change24h: data[coin].usd_24h_change,
// 		}));

// 		await Crypto.insertMany(cryptoEntries);
// 		console.log("Crypto data saved successfully");
// 	} catch (error) {
// 		console.error("Error fetching crypto data:", error);
// 	}
// };

// // Schedule the job to run every 2 hours
// cron.schedule("0 */2 * * *", fetchCryptoData);
// // cron.schedule("* * * * *", fetchCryptoData); // Runs every minute


// module.exports = fetchCryptoData;

const axios = require("axios");
const Crypto = require("../models/cryptoModel");
const cron = require("node-cron");

const COINGECKO_API = process.env.COINGECKO_API;
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const fetchCryptoData = async () => {
	try {
		const coins = ["bitcoin", "matic-network", "ethereum"];
		const apiUrl = `${COINGECKO_API}/simple/price?ids=${coins.join(
			","
		)}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&x_cg_demo_api_key=${COINGECKO_API_KEY}`;

		console.log("API URL:", apiUrl);
		const response = await axios.get(apiUrl, {
			headers: {
				"User-Agent": "CryptoApp/1.0",
			},
		});

		const data = response.data;

		const cryptoEntries = coins.map((coin) => ({
			coin,
			price: data[coin].usd,
			marketCap: data[coin].usd_market_cap,
			change24h: data[coin].usd_24h_change,
			createdAt: new Date(), // Timestamp for better tracking
		}));

		await Crypto.insertMany(cryptoEntries);
		console.log("Crypto data saved successfully");
	} catch (error) {
		console.error("Error fetching crypto data:");
		if (error.response) {
			console.error("Response data:", error.response.data);
			console.error("Response status:", error.response.status);
			console.error("Response headers:", error.response.headers);
		} else if (error.request) {
			console.error("No response received:", error.request);
		} else {
			console.error("Error message:", error.message);
		}
		console.error("Error config:", error.config);
	}
};

// Schedule the job to run every 2 hours
cron.schedule("0 */2 * * *", fetchCryptoData);

module.exports = fetchCryptoData;
