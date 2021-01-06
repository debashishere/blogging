const router = require('express').Router();
const Article = require('../model/Article');


//@desc show Home page
//@router GET /
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










module.exports = router;