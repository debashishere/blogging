const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        require: true
    },
    displayName: {
        type: String,
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    commentCount: {
        type: Number,
        default: 0,
    },
})

const User = mongoose.model('users', UserSchema);

module.exports = User;