const express = require('express');

const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.sendFile("index.html");
});

module.exports = router;
