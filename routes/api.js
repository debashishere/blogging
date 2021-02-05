const router = require('express').Router();
const article_api = require('./article_api');
const comment_api = require('./comment_api');
const replyRoute = require('./reply_api');
const moment = require('moment')
const { filterPublicArticles } = require('../controller/services')

const { sendMail } = require('../controller/sendmail');

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

//@desc post contact message
//@Route POST /api/contact
router.post('/contact', async (req, res) => {
    try {
        //send contact email to your mail
        await sendContactMail(req);

        // reply contacted user
        await replyContactMail(req)
        res.redirect('/');
    }
    catch (err) {
        res.redirect('/');
    }
})


const sendContactMail = async function (req) {
    try {
        const sender = req.body.email;
        const receiver = process.env.MESSAGE_RECEIVER;
        const subject = `message from bogging`
        const message = req.body.message;
        const template = `<h3>${message}</h3>`

        sendMail(sender, receiver, subject, message, template)
            .then(res => {
                console.log("mail send", res)
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (err) {

    }
}

const replyContactMail = async function (req) {
    try {
        const receiver = req.body.email;
        const sender = process.env.MESSAGE_RECEIVER;
        const subject = `Received your message at Debashis's Blog`;
        const message = `Thanks for your message ! we will get to you soon.`;
        const template = `<h4 style="color": "blue" >Thanks for your message ! we will get to you soon</h4>`;

        sendMail(sender, receiver, subject, message, template)
            .then(res => {
                console.log("mail send", res)
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (err) {

    }
}

module.exports = router;