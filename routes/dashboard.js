const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const article = require('../model/Article');

//@desc show personalised dashboard
//@route /dashboard
router.get('/', ensureAuth, async (req, res) => {
    try {
        // show all posts of the user
        // console.log('user', req.user)
        let articles = await article.find({ user: req.user._id }).lean()
        console.log(articles);
        res.render('dashboard/dashboard', {
            articles,
        });
    }
    catch (err) {

    }


})


module.exports = router;