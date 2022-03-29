const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TextSchema = new Schema(
    {
        text: { type: Buffer, required: true },
        textID: { type: String, required: true }
    }
);

module.exports = mongoose.model("Tex", TextSchema);