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
    reactionCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    reactionIds: [],
})


const Article = mongoose.model('blogs', ArticleSchema);


module.exports = Article;