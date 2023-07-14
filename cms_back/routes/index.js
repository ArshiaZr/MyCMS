const path = require("path");
const router = require("express").Router();

// Test Api
router.get("/status", async (req, res, next) => {
  return res.status(200).json({ success: true, msg: "API is up" });
});

router.use("/images", require(path.join(__dirname, "./images")));
router.use("/contacts", require(path.join(__dirname, "./contacts")));
router.use("/panel", require(path.join(__dirname, "./panel")));

module.exports = router;
