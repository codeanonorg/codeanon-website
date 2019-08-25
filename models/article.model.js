const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
        },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    tags: {
        type: [String],
    },
    description: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
    }
})

// Export the model
module.exports = mongoose.model('Articles', ArticleSchema)