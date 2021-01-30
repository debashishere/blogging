const path = require('path');
//MongoDb Services
const { getPublicAticlesByUser, getAticlesByUser, getPublicArticles, getArticleById, getCommentDb } = require('./services');


//render views

module.exports = {
    //@desc render home page
    renderHome: (req, res) => {
        let loggedUser = res.locals.loggedUser || null

        getPublicArticles()
            .then(articles => {
                // console.log(articles)
                res.render('home', {
                    layout: 'main',
                    js: 'home.js',
                    header_js: "header.js",
                    style: 'home.css',
                    header_style: 'header.css',
                    articles,
                    loggedUser,
                })
            })
            .catch(err => {
                //render error
            })

    },

    //@desc render about view
    renderAbout: (req, res) => {
        res.render('about')
    },

    //@desc render contact view
    renderContact: (req, res) => {
        res.render('contact')
    },

    //@desc render profile view
    renderProfile: (res) => {
        // access logged user from globals
        const loggedUser = res.locals.loggedUser || null
        //check if user is set
        if (loggedUser) {
            //get user articles
            const articles = getPublicAticlesByUser(loggedUser._id)
                .then(articleList => {

                    // if no articles available
                    if (!articleList) {
                        articleList = []
                    }
                    const totalPosts = articleList.length
                    res.render('profile/profile', {
                        layout: 'main',
                        style: "profile.css",
                        header_style: 'header.css',
                        footer_style: 'footer.css',
                        header_js: "header.js",
                        loggedUser,
                        articleList,
                        totalPosts,
                    })
                })
                .catch(err => {
                    //handle error
                })

        } else {
            //render Eroor
        }
    },

    //@desc render dashboard view
    renderDashboard: (req, res) => {
        // access logged user from globals
        const loggedUser = res.locals.loggedUser || null
        const articles = getAticlesByUser(loggedUser._id)
            .then(articleList => {
                // if no articles available
                if (!articleList) {
                    articleList = []
                }
                // console.log(articleList)
                const totalPosts = articleList.length
                res.render('dashboard/dashboard', {
                    style: "dashboard.css",
                    header_style: "header.css",
                    header_js: "header.js",
                    footer_style: 'footer.css',
                    articles: articleList,
                    totalPosts,
                });
            })
            .catch(err => {
                //handle error
            })

    },

    //@desc render add article view
    renderCreateArticle: (req, res) => {
        res.render('articles/add_article', {
            style: 'add_article.css',
            js: 'add_article.js',
            editor: true,
        })

    },

    //@desc render a single article view
    renderArticle: async (id, res) => {
        const loggedUser = res.locals.loggedUser || null;
        const comments = await getCommentDb(id, loggedUser);
        const result = getArticleById(id);
        result
            .then((article) => {
                if (article) {
                    res.render('articles/article', {
                        style: "article.css",
                        js: 'article.js',
                        comment_js: "comment.js",
                        header_style: "header.css",
                        footer_style: 'footer.css',
                        sheet_01: 'article_discussion.css',
                        editor: true,
                        article,
                        comments,
                        user: loggedUser
                    })
                } else {
                    // no article foound with that id
                    // render error
                }

            })
            .catch(err => {
                console.log('render error', err)
            })
    },

    //@desc render edit article view
    renderEditArticle: (id, res) => {
        res.render('articles/add_article', {
            style: 'add_article.css',
            js: "edit_article.js",
            editor: true,
            edit: true,
        })
    },

    //@desc render edit comment view
    renderEditComment: (comment, res) => {
        res.render('articles/edit_comment', {
            style: "edit_comment.css",
            header_style: "header.css",
            header_js: 'header.js',
            footer_style: 'footer.css',
            js: "edit_comment.js",
            user: res.locals.loggedUser,
            comment,
        });
    }
}