const express = require("express");
const router = express.Router();
const {createImage} = require("../controllers/homepage")


//const athentication = require("../middleware/authentication");

router.post("/createimage", createImage);


module.exports = router;