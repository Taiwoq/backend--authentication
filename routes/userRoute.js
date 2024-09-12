const express = require("express")
const { registerUser, userLogin, forgetPassword } = require("../controllers/userController")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login",userLogin)
router.post("/forgot-password",forgetPassword )








module.exports = router
