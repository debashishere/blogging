const path = require('path');
//MongoDb Services
const { getAticlesByUser, getPublicArticles, getArticleById } = require('./services');


//render views

module.exports = {
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
    renderAbout: (req, res) => {
        res.render('about')
    },
    renderContact: (req, res) => {
        res.render('contact')
    },
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
    // render add article page
    renderCreateArticle: (req, res) => {
        res.render('articles/add_article', {
            style: 'add_article.css',
            js: 'add_article.js',
            editor: true,

        })

    },
    //render a single article by id
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
    renderEditArticle: (id, res) => {
        const result = getArticleById(id);
        result
            .then((article) => {
                res.render('articles/edit_article', {
                    article,
                })
            })
            .catch(err => {
                console.log('render error', err)
            })
    }
}