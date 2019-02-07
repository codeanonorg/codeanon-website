const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },

    password: {
        type: String,
        required: true,
      }

}) 

let User = mongoose.model('User', UserSchema);
module.exports = userDb;