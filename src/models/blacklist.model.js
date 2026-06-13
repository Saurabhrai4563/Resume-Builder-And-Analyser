const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blacklist"]
    }
}, {
    timestamps: true
    //token kab blacklist hua tha
})

const tokenBlackListModel = mongoose.model("blacklistTokens", blackListTokenSchema);


module.exports = tokenBlackListModel;