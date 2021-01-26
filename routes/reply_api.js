const router = require('express').Router();
const { createNewReplyDb } = require('../controller/services');

//@desc get reply by comment id and article id
router.get('/:articleId/:commentId', (req, res) => {
    res.send("replys")
})



//@desc create a replay by comment id and article id
//@route POST /article/reply/:articleId/:commentId
router.post('/:articleId/:commentId', async (req, res) => {
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
// router.put()


// delete a reply by comment id and article id
// router.delete()


module.exports = router;