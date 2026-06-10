const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/**
 * 
 * @name registerUserController 
 * @description Register a new user,expect username,email and password in the request body,hash the password before saving to database
 * @public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Username, email and password are required"
        });
    }
    const isUserAlreadyExist = await userModel.findOne({ $or: [{ username }, { email }] });

    if (isUserAlreadyExist) {
        return res.status(400).json({
            success: false,
            message: "User with the same username or email already exists"
        })
    }
    const hash = await bectrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token)
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
/**
 * @name loginUsrController
 * @description Login a user,expect email and password in the request body,compare the password with the hashed password in the database and return a JWT token if the credentials are valid
 * @public
 */
module.exports = { registerUserController }