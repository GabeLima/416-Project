const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        content: { type: String, required: true },
        postDate: { type: Date, required: true }
    }
);

const GameSchema = new Schema(
    {
        isLive: { type: Boolean, required: true },
        players: { type: [String], required: true },
        panels: { type: [String], required: true },
        playerVotes: { type: [String], required: true},
        communityVotes: { type: [String], required: true },
        gameID: {type: String, required: true},
        comments: { type: [CommentSchema], required: true },
        rounds: { type: Number, required: true },
        timePerRound: { type: Number, required: true },
        isPublic: { type: Boolean, required: true },
        tags: { type: [String], required: true},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Game", GameSchema);