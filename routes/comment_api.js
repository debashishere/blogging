const router = require('express').Router();
const moment = require('moment');

const { createNewCommentDb, getCommentDb, deleteComment, updateCommentDb } = require('../controller/services');

//@desc get all comments of a article by id
//@route GET api/comments/:id 
router.get('/:id', async (req, res) => {
    try {
        const comments = await getCommentDb(req.params.id)
        // console.log('cmt', comments)
        // Arrange data 
        // let resData = []
        // comments.forEach(element => {
        //     let obj = {
        //         comment: {
        //             _id: element._id,
        //             text: element.text,
        //             createdAt: element.createdAt
        //         },
        //         creator: {
        //             displayName: element.creator.displayName,
        //             image: element.creator.image
        //         },
        //         reactions: element.reactions,
        //         replies: []
        //     }
        //     element.replies.forEach(item => {
        //         const reply = {
        //             id: item._id,
        //             text: item.text,
        //             createdAt: item.createdAt,
        //             creator: {
        //                 displayName: item.creator.displayName,
        //                 image: item.creator.image
        //             }

        //         }
        //         obj.replies.push(reply)
        //     })
        //     resData.push(obj);
        // })
        console.log('API CALLED ')
        res.send(comments)
    }
    catch (error) {
        console.log(error);
        return false;
    }
})

//@desc post a single comment
//@route POST api/comments/:id
router.post('/:id', async (req, res) => {
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
router.put('/:articleId/:commentId', async (req, res) => {
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

//@desc delte a single comment
//@route Delete api/comments/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await deleteComment(id)
        if (result) {
            res.redirect(req.get('referer'));
        } else {
            res.send(false);
        }
    }
    catch (error) {
        console.log(error);
        res.send(false);
    }


})

module.exports = router;