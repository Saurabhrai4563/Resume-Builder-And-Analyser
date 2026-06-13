const userModel = require("../models/user.model");
const tokenBlackListModel = require("../models/blacklist.model")
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
    //console.log(req.body);
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
    const hash = await bcrypt.hash(password, 10)

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
 * @acess public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const token = jwt.sign({
        id: user._id, username: user.username
    },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token)
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
/**
 * 
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (token) {
        await tokenBlackListModel.create({ token })
    }
    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully."
    })
}

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message: "User details fetached successfully",
        id: user._id,
        username: user.username,
        email: user.email
    })
}
module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }