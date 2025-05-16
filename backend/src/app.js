// File: backend/src/app.js
// Description: This file sets up the Express application and imports the necessary routes.

const express = require("express");
const dbRoutes = require("./routes/dbRoute");
const whatsappRoutes = require("./routes/whatsappRoutes");
const campaignRoutes = require("./routes/campaignRoutes");

const app = express();

app.use(express.json());
app.use("/db", dbRoutes);
app.use("/whatsapp", whatsappRoutes);
app.use("/campaign", campaignRoutes);

module.exports = app;
