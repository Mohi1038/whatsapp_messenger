const express = require("express");
const { sendMessage } = require("../services/whatsappService");

const router = express.Router();

router.post("/send", async (req, res) => {
    const { contacts } = req.body; // Expecting an array of { number, message }
    
    if (!contacts || !Array.isArray(contacts)) {
        return res.status(400).json({ error: "Invalid contacts format. Must be an array." });
    }

    try {
        const result = await sendMessage(contacts);
        res.json({
            success: true,
            message: "Messaging process completed.",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to send messages",
            details: error.message
        });
    }
});

module.exports = router;
