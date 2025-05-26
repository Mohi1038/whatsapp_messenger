// File: backend/src/app.js
// Description: This file sets up the Express application and imports the necessary routes.

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const appRoutes = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = express();

server.use(cors({
  origin: '*', // 
}));
server.use(express.json());
server.use("/api", appRoutes);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
