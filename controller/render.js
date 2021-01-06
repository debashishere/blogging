//MongoDb Services
const { getAticlesByUser, getPublicArticles, getArticleByID } = require('./services');




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
        const result = getArticleByID(id);
        result
            .then((article) => {
                res.render('articles/article', {
                    title: article.title
                })
            })
            .catch(err => {
                console.log('render error', err)
            })
    },
    renderProfile: (res) => {
        res.render('profile/profile', {
        })
    }
}