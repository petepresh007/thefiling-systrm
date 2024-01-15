const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    subject: {
        type: String,
    },
    test: {
        type: String,
        enum: ["fortnight", "midterm", "examination", "lesson plan", "lesson note"]
    },
    term: {
        type: String,
        enum: ["First Term", "Second Term", "Third Term"]
    },
    session: {
        type: String,
        default: "2023/2024",
        // required: [true, "enter a session"]
    },
    file: {
        filename: String,
        contentType: String,
        originalname: String,
        size: Number,
        path: String,
    },
    Class: {
        type: String
    },
    date: Date
})

module.exports = mongoose.model("File", fileSchema)