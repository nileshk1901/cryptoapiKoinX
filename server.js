// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cryptoRoutes = require("./routes/crypto");
const fetchCryptoData = require("./controllers/fetchCryptoData");


const app = express();
app.use(express.json());

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/crypto-stats";
// MongoDB connection
mongoose
	.connect(
		MONGODB_URI,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/crypto", cryptoRoutes);

// Start the server
const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	// Start the background job immediately
	fetchCryptoData();
});
