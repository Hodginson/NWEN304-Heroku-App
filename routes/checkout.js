const express = require('express');

const router = express.Router();

var path = require('path');

// Checkout page
router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/checkout.html'));
});

module.exports = router;
