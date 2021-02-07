const router = require('express').Router();
const { ensureApiAuth } = require('../middleware/auth');
const { createNewReplyDb, manageReplyLikeDb } = require('../controller/services');


//@desc like a replay by comment id and article id
//@route POST api/reply/like/:commentId/:replyId
router.post('/like/:commentId/:replyId', ensureApiAuth, async (req, res) => {

    try {
        const commentId = req.params.commentId;
        const replyId = req.params.replyId;
        const userId = req.body.userId;
        const replies = await manageReplyLikeDb(userId, commentId, replyId);
        const count = getReacCount(replyId, replies);
        res.status(201).send({ reactionCount: count })
    }

    catch (err) {
        console.log(err);
        res.status(404).send("Not found")
    }

})



//@desc create a replay by article id / comment id  
//@route POST api/reply/:articleId/:commentId
router.post('/:articleId/:commentId', ensureApiAuth, async (req, res) => {

    try {
        const articleId = req.params.articleId;
        const commentId = req.params.commentId;
        const creator = req.user._id;
        const data = {
            creator: creator,
            text: req.body.replyText,
            article: articleId,
            createdAt: Date.now()
        }
        const newReply = await createNewReplyDb(data, commentId, creator);
        const resData = {
            reply: {
                id: newReply._id,
                text: newReply.text,
                createdAt: newReply.createdAt,
            },
            creator: {
                displayName: newReply.creator.displayName,
                image: newReply.creator.image,
            }
        }
        res.status(201).send(resData); //created
    }

    catch (err) {
        res.status(406).send("Not accepted");
    }

})

//update a replay by comment id and article id

// delete a reply by comment id and article id

//get react6ion count of reacted reply
const getReacCount = function (replyId, replies) {

    let count;
    console.log('rply', replies)
    replies.forEach(reply => {
        if (replyId == reply._id) {
            count = reply.reactionCount;
        }
    })
    return count;

}


module.exports = router;