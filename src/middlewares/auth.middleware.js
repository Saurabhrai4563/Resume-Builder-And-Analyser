const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model")
async function authUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided"
        })
    }
    const isBlackListed = await tokenBlacklistModel.findOne({ token });
    if (isBlackListed) {
        return res.status(401).json({
            message: "Token is invalid. Please login again."
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next()
    }
    catch (err) {
        return res.status(401).json({
            message: "invalid token."
        })
    }

}

module.exports = { authUser }