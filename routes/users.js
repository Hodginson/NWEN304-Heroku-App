const express = require("express");


const router = express.Router();

// Log a user out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/index");
});


module.exports = router;
