const router = require('express').Router();
const fs = require('fs');
const { ensureApiAuth } = require('../middleware/auth');
const moment = require('moment')
const { filterPublicArticles } = require('../controller/services')
const { getArticleById, manageArticleLike, createNewArticle, updateArticle } = require('../controller/services');


//@desc process create blog
// @route POST /api/article/new
router.post('/new', ensureApiAuth, async (req, res) => {

    try {
        const user = req.user;
        const article = req.body;
        let newArticle = {
            title: article.title,
            body: article.editorData,
            status: article.status.toLowerCase(),
            user: user._id,
        }
        function verifyUser(data) {
            return data.user === user.id
        }
        // pull cover image with userid from cache
        const coverImageData = coverImages.filter(verifyUser);
        if (coverImageData.length > 0) {
            newArticle.cover_image = coverImageData[coverImageData.length - 1].filename
        }
        const isArticle = await createNewArticle(newArticle);
        if (isArticle) {
            // delete cover images except the new artilces cover image
            coverImages.forEach(data => {
                if (newArticle.cover_image != data.filename) {
                    deleteServerImage(data.filename)
                }
            })
            coverImages = [];
            res.status(201).send('Created');
        }
        else {
            res.status(503).send('service unavailable');
        }
    }

    catch (err) {
        console.log(err);
        res.status(503).send('service unavailable');
    }

});


//@desc Update post
//@route PUT /api/article/upadte/:id
router.put('/update/:id', ensureApiAuth, (req, res) => {
    const updatedArticle = getUpdatedArticleData(req.user, req.body)
    // update image and push to cache storage,
    UpdateArticleDb(res, updatedArticle, req.params.id, req.user._id)
})



//@desc send article data for edit post view
//@route GET /api/article/edit/data/:id
router.get('/edit/data/:id', ensureApiAuth, async (req, res) => {

    try {
        const articleId = req.params.id;
        const article = await getArticleById(articleId);
        if (article) {
            //article found
            const data = {
                editorData: article.body,
                title: article.title,
                cover_image_path: null,
                status: article.status,
            }
            if (article.cover_image) {
                data.cover_image_path = '/uploads/cover-images/' + article.cover_image
            }

            res.status(200).send(data);
        } else {
            // no article foound with that id
            res.status(404).send(`Article not foud with id ${articleId}`)
        }
    }

    catch (err) {
        res.status(500);
    }
})

//****************PUBLIC ROUTES**********************/

//@desc send article data for rendering post view
//@route GET /api/article/data/:id
router.get('/data/:id', (req, res) => {

    const result = getArticleById(req.params.id);
    result
        .then((article) => {
            if (article) {
                //article found
                const data = {
                    editorData: article.body,
                }
                res.status(200).send(data)
            } else {
                res.status(404).send("Not found")
            }
        })
        .catch(err => {
            console.log(err);
            res.send(500);
        })

})


//@desc Reac to a post
//@route POST /api/article/like/:postId/:userId
router.post('/like/:postId/:userId', ensureApiAuth, async (req, res) => {

    try {
        const postId = req.params.postId;
        const userId = req.params.userId;
        const reactionCount = await manageArticleLike(userId, postId);
        res.status(201).send({ reactionCount: reactionCount });
    }

    catch (errr) {
        res.status(404).send("not found");
    }

})

//@desc get weeeky posts
//@route GET api/article/weekly
router.get('/weekly', async (req, res) => {

    try {
        const endDate = Date.now()
        const startDate = moment().subtract(7, 'days');
        const articles = await filterPublicArticles(startDate, endDate);
        if (articles) {
            articles.forEach(article => {
                article.relativeDate = moment(article.createdAt).fromNow();
                article.createdAt = moment(article.createdAt).format("MMM Do")
            })
            res.status(200).send(articles);
        } else {
            res.status(404).send("not found");
        }
    }

    catch (err) {
        res.status(404).send("not found");
    }

})

//@desc get monthly posts
//@route GET api/article/monthly
router.get('/monthly', async (req, res) => {

    try {
        const endDate = Date.now()
        const startDate = moment().subtract(30, 'days');
        const articles = await filterPublicArticles(startDate, endDate)
        if (articles) {
            articles.forEach(article => {
                article.relativeDate = moment(article.createdAt).fromNow();
                article.createdAt = moment(article.createdAt).format("MMM Do")
            })
            res.send(articles);
        } else {
            res.status(404).send("not found");
        }
    }

    catch (err) {
        res.status(404).send("not found");
    }

})

//***************************FUNCTIONS******************** */

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

// update article with images
const getUpdatedArticleData = function (user, article) {

    function verifyUser(data) {
        return data.user === user.id
    }
    let updatedArticle = {
        title: article.title,
        body: article.editorData,
        status: article.status.toLowerCase(),
    }

    //check if cover image is updated
    // pull cover image with userid from cache
    if (updatedCoverImages.length > 0) {
        const coverImageData = updatedCoverImages.filter(verifyUser);

        //set updated cover image
        updatedArticle.cover_image = coverImageData[0].filename
    }
    return updatedArticle;
}


//@desc update single article by id in db
const UpdateArticleDb = async function (res, updatedArticle, articleId, userId) {

    try {
        const article = await getArticleById(articleId);
        if (!article) {
            res.status(404).send(`Article not fount with id ${articleId}`)
        }

        else {

            //check if logged user is creator
            if (userId.equals(article.user._id)) {
                const isUpdated = await updateArticle(articleId, updatedArticle);

                if (isUpdated) {
                    //check if image is updated
                    if (updatedArticle.cover_image != null && updatedArticle.cover_image != article.cover_image && article.cover_image != null) {
                        deleteServerImage(article.cover_image);
                        //delete all images uploaded while updating except new articles one
                        updatedCoverImages.forEach(data => {
                            if (data.filename != updatedArticle.cover_image) {
                                deleteServerImage(data.filename);
                            }
                        })
                        updatedCoverImages = []
                    }
                    res.status(200).send("Article updated successfully.")
                }

                else {
                    //not updated
                    // TODO: log Failure message
                    res.status(404).send('Not found');
                }

            }
            else {
                //user is not the creator
                console.log('Unautherised');
                res.status(401).send("Unautherized")
            }

        }
    }

    catch (err) {
        console.log(err);
        res.status(500);

    }

}

module.exports = router;