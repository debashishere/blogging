const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const Article = require('../model/Article');

//@desc show all blogs
//@route GET /
router.get("/", async (req, res) => {
    try {
        const articles = await Article.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('home', {
            layout: 'main',
            js: 'home.js',
            style: 'home.css',
            header_style: 'header.css',
            articles
        })
    } catch (err) {
        console.log(err)
        // render error page
    }

});

//@desc show create blog page
//@route GET /new
router.get('/new', ensureAuth, (req, res) => {
    res.render('add_article', {
        style: 'add_article.css'

    })
})

//@desc process create blog
//@route POST /new
router.post('/new', ensureAuth, async (req, res) => {
    try {
        const newArticle = new Article({
            title: req.body.title,
            body: req.body.body,
            status: req.body.status,
            user: req.user._id,
        })

        newArticle
            .save()
            .then(data => {
                // console.log('data', data)
                if (data) {
                    console.log('article created successfully'); //TODO: alert created
                }
            })
            .catch(err => {
                console.log(err);
            })

    }
    catch (err) {

    }
})




module.exports = router;