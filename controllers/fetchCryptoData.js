// cron/fetchCryptoData.js
const axios = require("axios");
const Crypto = require("../models/cryptoModel");
const cron = require("node-cron");


const COINGECKO_API = process.env.COINGECKO_API;
const fetchCryptoData = async () => {
	try {
		const coins = ["bitcoin", "matic-network", "ethereum"];
		const apiUrl = `${COINGECKO_API}/simple/price?ids=${coins.join(
			","
		)}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

		const response = await axios.get(apiUrl);
		const data = response.data;

		const cryptoEntries = coins.map((coin) => ({
			coin,
			price: data[coin].usd,
			marketCap: data[coin].usd_market_cap,
			change24h: data[coin].usd_24h_change,
		}));

		await Crypto.insertMany(cryptoEntries);
		console.log("Crypto data saved successfully");
	} catch (error) {
		console.error("Error fetching crypto data:", error);
	}
};

// Schedule the job to run every 2 hours
cron.schedule("0 */2 * * *", fetchCryptoData);
// cron.schedule("* * * * *", fetchCryptoData); // Runs every minute


module.exports = fetchCryptoData;
