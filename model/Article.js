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
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                deafult: null,
            },
            comment: {
                type: String,
                default: null,
            },
            createdAt: {
                type: Date,
                default: null,
            },
            replies: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'users',
                        deafult: null
                    },
                    reply: {
                        type: String,
                        deafult: null
                    },
                    createdAt: {
                        type: Date,
                        deafult: null,
                    }
                }
            ]
        }
    ]
})


const Article = mongoose.model('blogs', ArticleSchema);


module.exports = Article;