const path = require("path");
const router = require("express").Router();

router.use("/images", require(path.join(__dirname, "./images")));

module.exports = router;
