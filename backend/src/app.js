const express = require("express");
const dbRoutes = require("./routes/dbRoute");
const whatsappRoutes = require("./routes/whatsappRoutes");

const app = express();

app.use(express.json());
app.use("/db", dbRoutes);
app.use("/whatsapp", whatsappRoutes);

module.exports = app;
