const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const { createNewReplyDb, manageReplyLikeDb } = require('../controller/services');


//@desc like a replay by comment id and article id
//@route POST api/reply/like/:commentId/:replyId
router.post('/like/:commentId/:replyId', async (req, res) => {
    try {
        console.log('like reply')
        const commentId = req.params.commentId;
        const replyId = req.params.replyId;
        const userId = req.body.userId;
        const replies = await manageReplyLikeDb(userId, commentId, replyId);
        const count = getReacCount(replyId, replies);
        console.log('count', count)
        res.send({ reactionCount: count })
    }
    catch (err) {
        console.log(err);
        res.send(false)
    }
})



//@desc create a replay by comment id and article id
//@route POST /comments/reply/:articleId/:commentId
router.post('/:articleId/:commentId', ensureAuth, async (req, res) => {
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
        // console.log('createdReply', newReply)
        if (newReply) {
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

            res.send(resData);

        } else {
            res.send(false);
        }
    }
    catch (err) {
        console.log(err)
        res.send(false);
    }

})




//update a replay by comment id and article id



// delete a reply by comment id and article id

//get react6ion count of reacted reply
const getReacCount = function (replyId, replies) {
    let count;
    replies.forEach(reply => {
        if (replyId == reply._id) {
            count = reply.reactionCount;
        }
    })
    return count;
}


module.exports = router;