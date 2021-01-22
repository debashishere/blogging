const router = require('express').Router();
const article_api = require('./api/article_api');
const comment_api = require('./api/comment_api');


//@desc article api route
//@route /api/article
router.use('/article', article_api)

//@desc comments api route
//@route /api/comments
router.use('/comments', comment_api)

module.exports = router;