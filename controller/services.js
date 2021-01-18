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
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
            // TODO: render error
        }
    }
}