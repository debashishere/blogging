const router = require('express').Router();
const article_api = require('./article_api');
const comment_api = require('./comment_api');
const reply_api = require('./reply_api');
const contact_api = require('./contact_api');
const upload = require('./upload');


//@desc Upload files
//@route /api/upload/
router.use('/upload', upload);

//@desc article api route
//@route /api/article
router.use('/article', article_api)

//@desc comments api route
//@route /api/comments
router.use('/comments', comment_api)

//@desc replies api route
//@route /api/reply
router.use('/reply', reply_api)

//@desc contact api route 
//@Route POST /api/contact
router.use('/contact', contact_api);


module.exports = router;