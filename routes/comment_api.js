const router = require('express').Router();
const { ensureApiAuth } = require('../middleware/auth');
const { createNewCommentDb, deleteComment, updateCommentDb, manageCommentLikeDb } = require('../controller/services');


//*******************PUBLIC Route*************** */
//@desc like or dislike a single comment
//@route POST api/comments/like/:commentId
router.post('/like/:commentId', async (req, res) => {

    try {
        const commentId = req.params.commentId
        const userId = req.body.userId
        const reactionCount = await manageCommentLikeDb(userId, commentId);
        console.log(reactionCount)
        res.status(200).send({ reactionCount: reactionCount })
    }

    catch (err) {
        console.log(err);
        res.status(404).send(false)
    }

})


//********************PROTECTED ROUTE*************** */
//@desc post a single comment
//@route POST api/comments/:articleId
router.post('/:articleId', ensureApiAuth, async (req, res) => {

    try {
        const user = res.locals.loggedUser
        const articleId = req.params.articleId
        const comments = {
            article: articleId,
            creator: user._id,
            text: req.body.comment,
            createdAt: Date.now(),
        }
        const newComment = await createNewCommentDb(comments);
        if (newComment) {
            res.status(200).send({
                comment: newComment,
                creator: {
                    displayName: user.displayName,
                    image: user.image,
                }
            })
        } else {
            res.status(503).send('Service Unavailable');
        }
    }

    catch (err) {
        console.log(err);
        res.status(503).send('Service Unavailable');
    }

})

//@desc edit a single comment
//@route PUT api/comments/:commentId
router.put('/:commentId', ensureApiAuth, async (req, res) => {

    try {
        const commnetId = req.params.commentId;
        const data = req.body;
        const updatedComment = await updateCommentDb(commnetId, data);
        if (updatedComment) {
            res.status(200).send("Comment is updated succesfully.")
        } else {
            res.status(404).send('Not found');
        }
    }

    catch (err) {
        res.status(404).send('Not found');
    }

})

//@desc delete a single comment
//@route Delete api/comments/:id
router.delete('/:id', ensureApiAuth, async (req, res) => {

    try {
        const id = req.params.id
        const result = await deleteComment(id)
        if (result) {
            res.redirect(req.get('referer'));
        } else {
            res.redirect(req.get('referer'));
        }
    }

    catch (error) {
        console.log(error);
        res.redirect(req.get('referer'));
    }

})


module.exports = router;