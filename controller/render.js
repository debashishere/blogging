//MongoDb Services
const { getAticlesByUser, getPublicArticles, getArticleById } = require('./services');


//render views

module.exports = {
    renderHome: (req, res) => {
        const articles = getPublicArticles();
        res.render('home', {
            layout: 'main',
            js: 'home.js',
            style: 'home.css',
            header_style: 'header.css',
            articles
        })
    },
    renderAbout: (req, res) => {
        res.render('about')
    },
    renderContact: (req, res) => {
        res.render('contact')
    },
    renderProfile: (res) => {
        res.render('profile/profile', {
            layout: 'main',
            style: "profile.css",
            header_style: 'header.css',
        })
    },
    renderPublicArticle: (req, res) => {
        res.render('articles/public_article')
    },
    renderDashboard: (req, res) => {
        const articles = getAticlesByUser(req.user._id)
            .then(articleList => {
                res.render('dashboard/dashboard', {
                    articles: articleList,
                });
            })
            .catch(err => {
                //handle error
            })

    },
    // render add article page
    renderCreateArticle: (req, res) => {
        res.render('articles/add_article', {
            style: 'add_article.css'

        })
    },
    //render a single article
    renderArticle: (id, res) => {
        const result = getArticleById(id);
        result
            .then((article) => {
                res.render('articles/private_article', {
                    title: article.title
                })
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