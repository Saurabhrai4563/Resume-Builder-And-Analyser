const express = require("express");
const authcontroller = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @public 
 */
authRouter.post("/register", authcontroller.registerUserController);
/**
 * @route POST /api/auth/logi
 * @description login user with email and password
 * @access public
 */
authRouter.post("/login", authcontroller.loginUserController)
/**
 * @route  GET /api/auth/logout
 * @description clear token from user cookie and add token in blacklist
 * @access public
 */
authRouter.get("/logout", authcontroller.logoutUserController)

/**
 * @route Get /api/auth/get-me
 * @description get the current logged in user  details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authcontroller.getMeController)

module.exports = authRouter;