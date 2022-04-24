const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TextSchema = new Schema(
    {
        text: { type: String, required: true },
        textID: { type: String, required: true }
    }
);

module.exports = mongoose.model("Text", TextSchema);