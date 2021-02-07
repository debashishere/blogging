const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const fs = require('fs');

//controller fumctions
const { renderCreateArticle, renderArticle, renderEditArticle } = require('../controller/render');

//db processes

const { getCommentDb, getArticleById, deleteArticle, deleteArticleComment } = require('../controller/services');


//*******************SECURE ROUTES**************** */
//@desc show create article page
//@route GET /article/new
router.get('/new', ensureAuth, (req, res) => {
    renderCreateArticle(req, res);
});

//@desc delete article with id
//route DELETE /article/:id
router.delete('/:id', ensureAuth, async (req, res) => {

    try {
        const articleId = req.params.id;
        const deletedArticle = await deleteArticle(articleId);
        if (deletedArticle) {
            //delete all comments 
            await deleteArticleComment(articleId);
            //delete cover image
            if (deletedArticle.cover_image) {
                deleteServerImage(deletedArticle.cover_image)
            }
            res.redirect('/dashboard');
        }
    }

    catch (err) {
        console.log(err)
        res.redirect('/dashboard');
    }

})

//@desc show EDIT article page
//route GET /article/edit/:id
router.get('/edit/:id', ensureAuth, (req, res) => {
    renderEditArticle(req.params.id, res);
})


//********PUBLIC ROUTES************* */

//@desc show article with id
// route GET / article /: id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const loggedUser = res.locals.loggedUser || null;
        const comments = await getCommentDb(id, loggedUser);
        const result = getArticleById(id);
        result
            .then(article => {
                if (article) {
                    if (loggedUser) {
                        checkReacted(article, loggedUser._id);
                        renderArticle(loggedUser, article, comments, res)
                    } else {
                        renderArticle(null, article, comments, res)
                    }

                }
            })

    } catch (err) {

    }

});

//check user if reacted to the post
const checkReacted = function (article, userId) {
    const reactionIds = article.reactionIds;
    reactionIds.forEach(id => {
        if (userId == id) {
            article.isReacted = true;
        }
    })
}

//@desc delete image with name
const deleteServerImage = function (fileName) {
    let filePath = `./public/uploads/cover-images/${fileName}`
    //delete old image from server (not working)
    console.log('delete', filePath)
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log('error while deleting cover image from server', err);
        }
    })
}

module.exports = router;