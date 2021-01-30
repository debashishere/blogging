const router = require('express').Router();
const article_api = require('./article_api');
const comment_api = require('./comment_api');
const replyRoute = require('./reply_api');


//@desc article api route
//@route /api/article
router.use('/article', article_api)

//@desc comments api route
//@route /api/comments
router.use('/comments', comment_api)

//@desc replies api route
//@route /api/reply
router.use('/reply', replyRoute)

module.exports = router;