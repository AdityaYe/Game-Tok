const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();


router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);


router.post("/creator/register", authController.registerCreator);
router.post("/creator/login", authController.loginCreator);
router.get("/creator/logout", authController.logoutCreator);


module.exports = router;