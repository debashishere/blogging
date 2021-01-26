const Article = require('../model/Article');
const Comment = require('../model/Comment');

//databse services

module.exports = {

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
            console.log('newArticle', newArticle)
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
            console.log('article', article)
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
            // TODO: render error
        }
    },


    //*****************************************Comment and Reply ***************************************/

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
    getCommentDb: async function (id) {
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
                            displayName: element.creator.displayName,
                            image: element.creator.image
                        },
                        reactions: element.reactions,
                        replies: []
                    }
                    element.replies.forEach(item => {
                        const reply = {
                            id: item._id,
                            text: item.text,
                            createdAt: item.createdAt,
                            creator: {
                                displayName: item.creator.displayName,
                                image: item.creator.image
                            }

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
    createNewCommentDb: async function (comments) {
        try {
            console.log('comments', comments)
            //insert into db
            const comment = await Comment.create(comments);
            if (comment._id) {
                return comment;
            } else {
                return comment;
            }
        }
        catch (err) {
            console.log(err)
            //handle db error
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
            const result = await Comment.findByIdAndDelete(id).exec();
            // console.log('is deleted', result)
            return result;
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

    //******************************REPLY*********************/

    //@desc create single reply in db
    createNewReplyDb: async function (reply, commentId, creator) {
        try {
            const result = await Comment.findOneAndUpdate({ _id: commentId }, { $push: { replies: reply } }, { new: true, runValidators: true })
                .populate({
                    path: 'replies.creator'
                })

            let len = result.replies.length - 1
            let createdReply = {}

            //get created comment
            for (i = len; i >= 0; i--) {
                if (result.replies[i].creator.equals(creator._id)) {
                    createdReply = result.replies[i]
                    break;
                }
            }

            // console.log('new reply', createdReply)
            return createdReply;
        }
        catch (err) {
            console.log(err)
        }


        // article id , article comments id
        //create reply in db
        // user
        // reply


        //return 
        // reply id
        //commentid
        // reply text
        // creator displayName
        // creator image
    }





}