
const Article = require('../model/Article');
const Comment = require('../model/Comment');
const User = require('../model/User');
//databse services

module.exports = {

    search: async (searchTerm) => {

        try {
            const doc = await Article.find({ title: { $regex: searchTerm, $options: "i" }, status: "public" }, { title: 1, reactionCount: 1, commentCount: 1, createdAt: 1 })
                .populate('user', '_id displayName image')
                .lean()
                .exec();
            return doc;
        }

        catch (err) {
            console.log(err)
            return false;
        }

    },

    //get all public articles
    getPublicArticles: async () => {

        try {
            const articles = await Article.find({ status: 'public' })
                .populate('user')
                .sort({ createdAt: 'desc' })
                .lean()
            return articles;
        }

        catch (err) {
            // Hanlde error
            return false;
        }

    },

    // get public articles within time frame
    filterPublicArticles: async (startDate, endDate) => {

        try {
            const articles = await Article.find({ status: 'public', createdAt: { $gte: startDate, $lt: endDate } },
                { title: 1, cover_image: 1, reactionCount: 1, commentCount: 1, createdAt: 1 })
                .populate('user', '_id displayName image')
                .sort({ createdAt: 'desc' })
                .lean()
            return articles;
        }

        catch (err) {
            return false;
        }

    },

    //get public articles by userid
    getPublicAticlesByUser: async (userId) => {

        try {
            //fetch all post with userId
            const articles = await Article.find({ user: userId, status: 'public' }).lean();
            if (articles.length > 0) {
                return articles;
            }
            else {
                //error
            }
        }

        catch (err) {

        }

    },

    //get articles by userid
    getAticlesByUser: async (userId) => {

        try {
            //fetch all post with userId
            const articles = await Article.find({ user: userId }).lean();
            if (articles.length > 0) {
                return articles;
            }
            else {
                //error
            }
        }

        catch (err) {

        }

    },

    //get one article by id
    getArticleById: async (id) => {

        try {
            const article = await Article.findById(id).lean().populate('user').exec();
            if (article) {
                return article;
            } else {
                return false;
            }
        }

        catch (err) {
            //handle db error
            return false;
        }

    },

    //create a new article in db
    createNewArticle: async (newArticle) => {

        try {
            //insert into db
            const article = await Article.create(newArticle);
            if (article._id) {
                return true;
            } else {
                return false;
            }
        }

        catch (err) {
            console.log(err)
            //handle db error
            return false;
        }

    },

    //delete a article by id
    deleteArticle: async (id) => {

        try {
            const result = await Article.findByIdAndDelete(id).exec();
            return result;
        }

        catch (err) {
            return false;
        }

    },

    //update a article by id
    updateArticle: async (id, data) => {

        try {
            const article = await Article.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true });
            return true;
        }

        catch (err) {
            console.log(err);
            return false;
            // TODO: render error
        }

    },

    // like and dislike a article
    manageArticleLike: async (userId, articleId) => {

        try {
            let found = false;
            const result = await Article.find({ _id: articleId }).exec();
            const foundArticle = result[0];
            //check if user liked the post
            if (foundArticle._id.equals(articleId)) {
                foundArticle.reactionIds.forEach(async (id) => {
                    if (id == userId) {
                        found = true;
                    }
                })
            }
            if (!found) {
                const article = await Article.findOneAndUpdate({ _id: articleId }, { $inc: { 'reactionCount': '1' }, $addToSet: { reactionIds: userId } }, { new: true }).exec();
                return article.id ? article.reactionCount : false;
            } else {
                const article = await Article.findOneAndUpdate({ _id: articleId }, { $inc: { 'reactionCount': '-1' }, $pull: { reactionIds: userId } }, { new: true }).exec();
                return article.id ? article.reactionCount : false;
            }
        }

        catch (err) {
            return false;
        }

    },



    //*****************************************Comment***************************************/
    //@desc get a single comment by id
    getCommnetByIdDb: async function (id) {

        try {
            const comment = await Comment.findById(id).lean().exec();
            if (comment) {
                return comment;
            } else {
                return false;
            }
        }

        catch (err) {
            console.log(err);
            return false;
        }

    },

    //@desc get all comments by article id
    getCommentDb: async function (id, user) {

        try {
            const comments = await Comment.find({ article: id })
                .lean()
                .populate('creator')
                .populate({
                    path: 'replies.creator'
                })
                .sort({ createdAt: -1 })
                .exec();

            if (comments) {
                // Arrange data 
                let resData = []
                comments.forEach(element => {
                    let obj = {
                        comment: {
                            _id: element._id,
                            text: element.text,
                            createdAt: element.createdAt
                        },
                        creator: {
                            _id: element.creator._id,
                            displayName: element.creator.displayName,
                            image: element.creator.image
                        },
                        reactionCount: element.reactionCount,
                        isReacted: false,
                        replies: []
                    }

                    //check user is reacted the comment
                    if (user) {
                        element.reactionIds.forEach(id => {
                            if (id == user._id) {
                                obj.isReacted = true;
                            }
                        })
                    }
                    element.replies.forEach(item => {
                        const reply = {
                            id: item._id,
                            text: item.text,
                            createdAt: item.createdAt,
                            creator: {
                                displayName: item.creator.displayName,
                                image: item.creator.image
                            },
                            reactionCount: item.reactionCount,
                            isReacted: false
                        }
                        //check user is reacted the reply
                        if (user) {
                            item.reactionIds.forEach(id => {
                                if (id == user._id) {
                                    reply.isReacted = true;
                                }
                            })
                        }
                        obj.replies.push(reply)
                    })
                    resData.push(obj);
                })
                return resData;
            } else {
                return false;
            }
        }

        catch (err) {
            console.log(err);
            return false;
        }

    },


    //@desc create new comment in db
    createNewCommentDb: async function (newComment) {

        try {
            const userId = newComment.creator
            const comment = await Comment.create(newComment);
            if (comment._id) {
                await Article.findOneAndUpdate({ _id: comment.article }, { $inc: { 'commentCount': '1' } }).exec()
                await User.findOneAndUpdate({ _id: userId }, { $inc: { 'commentCount': '1' } }).exec()

                return comment;
            } else {
                return false;
            }

        }
        catch (err) {
            console.log(err)
            return false;
        }

    },

    //@desc update single comment by id 
    updateCommentDb: async function (commentId, data) {

        try {
            const updatedComment = await Comment.findOneAndUpdate({ _id: commentId }, data, { new: true, runValidators: true });
            if (updatedComment) {
                return updatedComment;
            } else {
                return false;
            }
        }

        catch (err) {
            console.log(err);
            return false;
        }

    },

    //@desc DELETE comment BY ID
    deleteComment: async (id) => {

        try {
            const deletedComment = await Comment.findByIdAndDelete(id).exec();
            //decrement commnet count in Article collection
            await Article.findOneAndUpdate({ _id: deletedComment.article }, { $inc: { 'commentCount': '-1' } }).exec()

            //decrement comment count in user collection
            await User.findOneAndUpdate({ _id: userId }, { $inc: { 'commentCount': '-1' } }).exec()
            return deletedComment;
        }

        catch (err) {
            return false;
        }

    },

    //@desc DELETE all comment by article id
    deleteArticleComment: async (articleId) => {

        try {
            await Comment.deleteMany({ article: articleId })
                .then(status => {
                    // console.log(status);
                    return true;
                })
        }

        catch (err) {
            console.log(err)
            return falsee;
        }

    },

    //@desc increment or decrement comment like by 1
    manageCommentLikeDb: async function (userId, commentId) {

        try {
            let found = false;
            const result = await Comment.find({ _id: commentId }).exec();
            const foundComment = result[0];
            //check if user liked the comment
            if (foundComment._id.equals(commentId)) {
                foundComment.reactionIds.forEach(async (id) => {
                    if (id == userId) {
                        found = true;
                    }
                })
            }
            if (!found) {
                const comment = await Comment.findOneAndUpdate({ _id: commentId }, { $inc: { 'reactionCount': '1' }, $addToSet: { reactionIds: userId } }, { new: true }).exec();
                return comment.id ? comment.reactionCount : false;
            } else {
                const comment = await Comment.findOneAndUpdate({ _id: commentId }, { $inc: { 'reactionCount': '-1' }, $pull: { reactionIds: userId } }, { new: true }).exec();
                return comment.id ? comment.reactionCount : false;
            }
        }

        catch (err) {
            console.log(err);
            return false;
        }

    },



    //****************************************REPLY******************************************/
    //@desc create single reply in db
    createNewReplyDb: async (reply, commentId, creator) => {

        try {
            const result = await Comment.findOneAndUpdate({ _id: commentId }, { $push: { replies: reply } }, { new: true, runValidators: true })
                .populate({
                    path: 'replies.creator'
                })
            let len = result.replies.length - 1
            let createdReply = {}
            //get created reply
            for (i = len; i >= 0; i--) {
                if (result.replies[i].creator.equals(creator._id)) {
                    createdReply = result.replies[i]
                    break;
                }
            }
            return createdReply;
        }

        catch (err) {
            console.log(err)
            return (false);
        }

    },

    //@desc increment reactions by 1
    manageReplyLikeDb: async (userId, commentId, replyId) => {

        try {
            let found = false;
            const result = await Comment.find({ _id: commentId }).exec();
            const foundComment = result[0];
            //check if user liked the reply
            if (foundComment._id.equals(commentId)) {
                if (foundComment.replies.length != 0) {
                    foundComment.replies.forEach(reply => {
                        if (reply._id == replyId) {
                            if (reply.reactionIds.length != 0) {
                                reply.reactionIds.forEach(async (id) => {
                                    if (id == userId) {
                                        found = true;
                                    }
                                })
                            }
                        }

                    })
                }
            }
            if (!found) {
                const comment = await Comment.findOneAndUpdate({ _id: commentId, 'replies._id': replyId }, { $inc: { 'replies.$.reactionCount': '1' }, $addToSet: { 'replies.$.reactionIds': userId } }, { new: true }).exec();
                return comment.id ? comment.replies : false;
            } else {
                const comment = await Comment.findOneAndUpdate({ _id: commentId, 'replies._id': replyId }, { $inc: { 'replies.$.reactionCount': '-1' }, $pull: { 'replies.$.reactionIds': userId } }, { new: true }).exec();
                return comment.id ? comment.replies : false;
            }

        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

}