const Article = require('../model/Article');

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
    getArticleByID: async (id) => {
        try {
            const article = await Article.findById(id).exec();
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
    createNewArticle: async (req) => {
        try {
            const newArticle = {
                title: req.body.title,
                cover_image: req.file.filename,
                body: {
                    text: req.body.body,
                },
                status: req.body.status,
                user: req.user._id,
            }
            console.log('inserting')
            const article = await Article.create(newArticle);
            if (article._id) {
                return true;
            } else {
                return false;
            }
        }
        catch (err) {
            //handle db error
            return false;
        }
    }
}