const express = require("express");
const axios = require("axios");
const logger = require("../lib/logger");
const router = express.Router();

router.get("/", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.head(imageUrl); // Fetch metadata only
    const contentLength = response.headers["content-length"];

    if (contentLength && parseInt(contentLength, 10) >= 1048576) {
      // 1MB = 1048576 bytes
      return res.json({ error: "Image must be smaller than 1MB", status: 500 });
    }

    res.json({ valid: true, status: 200 });
  } catch (error) {
    logger.error(`[checkImageSize.js] ${error}`);
    res.status(500).json({ error: "Error checking image size" });
  }
});

module.exports = router;
