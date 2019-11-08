const express = require('express');

const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.sendFile("UserPage.html");
});

module.exports = router;
