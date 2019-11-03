const express = require('express');

const router = express.Router();

var path = require('path');

// login page
router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/login.html'));
});

module.exports = router;
