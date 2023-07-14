const path = require("path");
const router = require("express").Router();

router.use("/accounts", require(path.join(__dirname, "./accounts")));
router.use("/admins", require(path.join(__dirname, "./admins")));
router.use("/contents", require(path.join(__dirname, "./contents")));
router.use("/employees", require(path.join(__dirname, "./employees")));
router.use("/files", require(path.join(__dirname, "./files")));
router.use("/logs", require(path.join(__dirname, "./logs")));
router.use("/permissions", require(path.join(__dirname, "./permissions")));
router.use("/roles", require(path.join(__dirname, "./roles")));

module.exports = router;
