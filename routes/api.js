const router = require('express').Router();
const article_api = require('./article_api');
const comment_api = require('./comment_api');
const replyRoute = require('./reply_api');
const moment = require('moment')
const { filterPublicArticles } = require('../controller/services')

//@desc article api route
//@route /api/article
router.use('/article', article_api)

//@desc comments api route
//@route /api/comments
router.use('/comments', comment_api)

//@desc replies api route
//@route /api/reply
router.use('/reply', replyRoute)

//@desc get weeeky posts
//@route GET /weekly
router.get('/weekly', async (req, res) => {
    try {
        const endDate = Date.now()
        const startDate = moment().subtract(7, 'days');
        await filterPublicArticles(startDate, endDate)
            .then(articles => {
                if (articles) {
                    articles.forEach(article => {
                        article.relativeDate = moment(article.createdAt).fromNow();
                        article.createdAt = moment(article.createdAt).format("MMM Do")
                    })
                    res.send(articles);
                } else {
                    res.send(false);
                }
            })
            .catch(err => {
                res.send(false);
            })
    }
    catch (err) {
        res.send(false);
    }
})

//@desc get monthly posts
//@route GET /monthly
router.get('/monthly', async (req, res) => {
    try {
        const endDate = Date.now()
        const startDate = moment().subtract(30, 'days');
        await filterPublicArticles(startDate, endDate)
            .then(articles => {
                if (articles) {
                    articles.forEach(article => {
                        article.relativeDate = moment(article.createdAt).fromNow();
                        article.createdAt = moment(article.createdAt).format("MMM Do")
                    })
                    res.send(articles);
                } else {
                    res.send(false);
                }
            })
            .catch(err => {
                res.send(false);
            })
    }
    catch (err) {
        res.send(false);
    }
})

module.exports = router;