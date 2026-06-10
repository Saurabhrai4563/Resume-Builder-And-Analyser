const express = require("express");
const authcontroller = require("../controllers/auth.controller");
const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @public 
 */
authRouter.post("/register", authcontroller.registerUserController);

module.exports = authRouter;