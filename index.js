const cron = require("node-cron");
const express = require("express");
const { configDotenv } = require("dotenv");
const { main } = require("./func/main");
const { mission } = require("./func/Mission");
configDotenv();

main();
mission();
cron.schedule("0 * * * *", mission);

// Start the server
const port = process.env.PORT || 104;
const app = express();

app.get("/", (req, res) => {
  res.send("API cron job server is running");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
