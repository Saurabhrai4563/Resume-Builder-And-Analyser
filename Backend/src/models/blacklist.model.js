const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blacklist"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d'
    }
}, {
    timestamps: true
})

const tokenBlackListModel = mongoose.model("blacklistTokens", blackListTokenSchema);


module.exports = tokenBlackListModel;