const path = require('path');
//MongoDb Services
const { getAticlesByUser, getPublicArticles, getArticleById } = require('./services');


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
            const articles = getAticlesByUser(loggedUser._id)
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
    renderArticle: (id, res) => {
        const result = getArticleById(id);
        result
            .then((article) => {
                if (article) {
                    console.log()
                    res.render('articles/article', {
                        style: "article.css",
                        js: 'article.js',
                        header_style: "header.css",
                        editor: true,
                        article
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
    }
}