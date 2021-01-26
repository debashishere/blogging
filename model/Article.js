const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    cover_image: {
        type: String
    },
    body:
    {
        type: Object
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reactions: {
        type: Number,
        default: 0
    },
    comments: [
        {
            creator: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                deafult: null,
            },
            comment: {
                type: String,
                default: null,
            },
            reactions: {
                type: Number,
                default: 0
            },
            createdAt: {
                type: Date,
                default: null,
            },
        }
    ]
})


const Article = mongoose.model('blogs', ArticleSchema);


module.exports = Article;