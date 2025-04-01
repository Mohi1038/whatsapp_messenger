const express = require("express");
const {addUser, addCampaign, addCustomer, getCustomer} = require("../services/dbService");

const router = express.Router();

router.post("/addUser", async (req, res) => {
  const user = req.body;
  console.log(user);
  
  if (!user || !user.User_ID) {
    return res.status(400).json({ error: "Invalid user data." });
  }

  try {
    await addUser(user);
    res.json({success: true, message: "User added successfully!"});
  } catch (error) {
    res.status(500).json({error: "Failed to add user", details: error.message});
  }
});

router.post("/addCampaign", async (req, res) => {
  const user = req.body;
  console.log(user);
  
  if (!user || !user.Campaign_ID) {
    return res.status(400).json({ error: "Invalid Camapaign data." });
  }

  try {
    await addCampaign(user);
    res.json({success: true, message: "Campaign added successfully!"});
  } catch (error) {
    res.status(500).json({error: "Failed to add user", details: error.message});
  }
});

router.post("/addCustomer", async (req, res) => {
  const user = req.body;
  console.log(user);
  
  if (!user || !user.User_ID) {
    return res.status(400).json({ error: "Invalid Customer data." });
  }

  try {
    await addCustomer(user);
    res.json({success: true, message: "Customer added successfully!"});
  } catch (error) {
    res.status(500).json({error: "Failed to add user", details: error.message});
  }
});

router.get("/getCustomer", async (req, res) => {
  const user = req.body;
  console.log(user);
  
  if (!user || !user.Campaign_ID) {
    return res.status(400).json({ error: "Invalid Customer data." });
  }

  try {
    const result = await getCustomer(user);
    res.json({success: true, data: result});
  } catch (error) {
    res.status(500).json({error: "Failed to get customer", details: error.message});
  }
});

module.exports = router;