const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogs',
        require: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    text: {
        type: String,
        default: null,
        require: true

    },
    reactionCount: {
        type: Number,
        default: 0,
    },
    reactionIds: [],
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [
        {
            creator: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                deafult: null
            },
            text: {
                type: String,
                deafult: null
            },
            createdAt: {
                type: Date,
                deafult: null,
            },
            reactionCount: {
                type: Number,
                default: 0,
            },
            reactionIds: [],
        }
    ]
})




const Comment = mongoose.model('comments', CommentSchema);


module.exports = Comment;