const { loginAdmin, stayLoggedIn, registerAdmin, RemoveAllAdmin, getAllAdmin, editAdmin } = require("../controllers/admin");
const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication")


router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/stay_loggedin", authentication, stayLoggedIn)


module.exports = router

