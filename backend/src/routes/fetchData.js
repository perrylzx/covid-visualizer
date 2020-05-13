var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/download", (req, res) => {
  console.log("asb");
  res.send("asdf");
});

module.exports = router;
