var express = require("express");
var secured = require("../lib/middleware/secured");
var router = express.Router();

/* GET user profile. */
router.get("/user", secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.render("user", {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: "Profile page",
  });
});

router.get("/session", secured(), function (req, res) {
  console.log(req.sessionID);
  res.send(req.sessionID);
});

router.post("/session", secured(), function (req, res) {
  console.log(req.sessionID);
  req.sessionID = "";
  res.send(req.sessionID);
});

module.exports = router;
