const path = require("path");
const router = require("express").Router();

// Test Api
router.get("/api/v1/status", async (req, res, next) => {
  return res.status(200).json({ success: true, msg: "API is up" });
});

router.use("/images", require(path.join(__dirname, "./images")));
router.use("/api/v1/management", require(path.join(__dirname, "./management")));
router.use("/api/v1/contacts", require(path.join(__dirname, "./contacts")));

module.exports = router;
