const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let UserSchema = new Schema({
    username: {
        type: String, 
    required: true,
},
    email: {
        type: String,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'moderateur','membre']
    },
    likedArticles: {
        type: [ObjectId],

    },
    timestamp: {
        // quand cela a été crée
        type: INT,
        required: TRUE
    }
})

// Export the model
module.exports = mongoose.model('Users', UserSchema)