const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema({
    description: String,
    category: {
        type: String,
        enum: ["Sports", "Academics", "Music", "ICT", "Culture", "Faces"]
    },
    file: {
        type: Array,
        required: [true, "The file is needed"]
    }
})

module.exports = mongoose.model("Homepage", homePageSchema)