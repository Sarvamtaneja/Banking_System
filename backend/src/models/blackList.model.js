const mongoose = require("mongoose");


const tokenBlackListSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, "Tokken is required to black list"],
        unique: [true, "Tokken is already black listed"],

    },
}, {
    timestamps: true
})

tokenBlackListSchema.index({ createdAt: 1}, {
    expiredAfterSeconds: 60 * 60 * 24 * 3 //3 days
})

const tokenBlackListModel = mongoose.model("tokenBlackList", tokenBlackListSchema);

module.exports = tokenBlackListModel;