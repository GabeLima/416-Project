const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        followers: { type: [String], required: true },
        following: { type: [String], required: true },
        followedTags: { type: [String], required: true },
        securityQuestion: { type: String, required: true },
        securityAnswer: {type: String, required: true }
    },
    { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);