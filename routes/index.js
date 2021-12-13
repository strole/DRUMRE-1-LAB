var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Auth0 Webapp sample Nodejs" });
});

router.get("/cats", function (req, res) {
  res.send("Cestitamo!");
});

router.post("/content", function (req, res) {
  console.log(req.body);
  return res.redirect("/");
});

module.exports = router;
