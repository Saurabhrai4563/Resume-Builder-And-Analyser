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
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email and password are required"
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
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
        const secret = process.env.JWT_SECRET.trim();
        const token = jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error during registration" });
    }
}

async function loginUserController(req, res) {
    try {
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
        const secret = process.env.JWT_SECRET.trim();
        const token = jwt.sign({
            id: user._id, username: user.username
        },
            secret,
            { expiresIn: "1d" }
        )
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
        res.status(200).json({
            message: "User loggedIn successfully.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error during login" });
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
        if (token) {
            const isBlackListed = await tokenBlackListModel.findOne({ token });
            if (!isBlackListed) {
                await tokenBlackListModel.create({ token });
            }
        }
        res.clearCookie("token");

        res.status(200).json({
            message: "User logged out successfully."
        })
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error during logout" });
    }
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("GetMe error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }