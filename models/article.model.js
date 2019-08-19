const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ArticleSchema = new Schema({
    title: {type: String},
    author: {type: String},
    date: {type: Number},
    tags: {type: String},
    description: {type: String},
    content: {type: String},
})

// Export the model
module.exports = mongoose.model('Article', ArticleSchema)