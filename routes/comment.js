const router = require('express').Router();
const { getCommnetByIdDb } = require('../controller/services');
const { renderEditComment } = require('../controller/render');
const { ensureAuth } = require('../middleware/auth');

//@desc edit a single comment
//@route GET /comments/edit/:id
router.get('/edit/:articleId/:commentId', ensureAuth, async (req, res) => {

    try {
        const commentId = req.params.commentId
        const comment = await getCommnetByIdDb(commentId);
        if (comment) {
            const data = {
                id: comment._id,
                text: comment.text,
            }

            renderEditComment(data, res);
        } else {
            //render error
        }

    }
    catch (err) {
        console.log(err);
        //render  error
    }

})









module.exports = router;