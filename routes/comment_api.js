const router = require('express').Router();

const { ensureAuth } = require('../middleware/auth');

const { createNewCommentDb, deleteComment, updateCommentDb, manageCommentLikeDb } = require('../controller/services');

//@desc post a single comment
//@route POST api/comments/:id
router.post('/:id', ensureAuth, async (req, res) => {
    try {
        const user = res.locals.loggedUser
        const id = req.params.id

        const comments = {
            article: id,
            creator: user._id,
            text: req.body.comment,
            createdAt: Date.now(),
        }
        const newComment = await createNewCommentDb(comments);
        if (newComment) {
            res.send({
                comment: newComment,
                creator: {
                    displayName: user.displayName,
                    image: user.image,
                }
            })
        } else {
            res.send(false);
        }
    }
    catch (err) {
        console.log(err);
        res.send(false);
    }
})

//@desc edit a single comment
//@route PUT api/comments/:articleId/:commentId
router.put('/:articleId/:commentId', ensureAuth, async (req, res) => {
    try {
        const articleId = req.params.articleId;
        const commnetId = req.params.commentId;
        const data = req.body;

        const updatedComment = await updateCommentDb(commnetId, data);
        if (updatedComment) {
            res.send(true)
        } else {
            res.send(false);
        }
    }
    catch (err) {
        console.log(err)
        //render error
        res.send(false);
    }
})

//@desc delete a single comment
//@route Delete api/comments/:id
router.delete('/:id', ensureAuth, async (req, res) => {
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


//@desc like or dislike a single comment
//@route POST api/comments/like/:commentId
router.post('/like/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId
        const userId = req.body.userId
        const reactionCount = await manageCommentLikeDb(userId, commentId);
        res.send({ reactionCount: reactionCount })
    }
    catch (err) {
        console.log(err);
        res.send(false)
    }
})

module.exports = router;