const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Simple route for testing
app.get("/", (req, res) => {
  res.send("✅ SendPulse AI Bot server is running!");
});

// Example webhook
app.post("/webhook", (req, res) => {
  console.log("📩 Webhook received:", req.body);
  res.status(200).send("Webhook OK");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});