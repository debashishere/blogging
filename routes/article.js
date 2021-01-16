const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const Article = require('../model/Article');
const path = require('path');

//controller fumctions
const { renderCreateArticle, renderArticle, renderEditArticle } = require('../controller/render');
const { createNewArticle, deleteArticle, getArticleById, updateArticle } = require('../controller/services');

//multor config functions
const { upload, coverUpload } = require('../config/multer');



//*******************SECURE ROUTES**************** */
// images 
let articleImages = []
// let coverImages = []

//@desc show create article page
//@route GET /article/new
router.get('/new', ensureAuth, (req, res) => {
    renderCreateArticle(req, res);
});

//@desc Upload image with editor js
//@route POST /article/new/upload
router.post('/new/upload', ensureAuth, upload.single('cover-image'), (req, res) => {
    articleImages.push(req.file.filename)

    //res for editor js
    const resData = {
        "success": 1,
        "file": {
            "url": `http://localhost:3000/uploads/images/${req.file.filename}`
        }
    }

    res.send(resData)
})

//@desc Upload post's cover-image 
//@route POST /article/new/cover
router.post('/new/cover', ensureAuth, coverUpload.single('cover_image'), (req, res) => {
    // upload image and push to cache storage,
    const imageData = {
        user: req.user.id,
        filename: req.file.filename,
        path: '/uploads/cover-images/' + req.file.filename
        // cover_image: req.file
    }
    coverImages.push(imageData)
    console.log('cover images', coverImages)
    //set status 1 if everything fine
    res.send({
        status: 1,
        path: imageData.path
    })
})


//@desc process create blog
// @route POST /article/new
router.post('/new', ensureAuth, (req, res) => {
    console.log(req.body);

    //craete article in db
    const article = createNewArticle(req, res);
    article
        .then(isArticle => {
            //check if article is created
            if (isArticle) {
                // TODO: Alert created message

                //send status 1 if everything is fine
                res.send({ status: 1 })
            }
            else {
                //TODO: render error
                res.send({ status: 0 })
            }
        })
        .catch(err => {
            console.log(err);
            //Handle Error
            res.send({ status: 0 })
        })

});


//@desc delete article with id
//route DELETE /article/:id
router.delete('/:id', ensureAuth, (req, res) => {
    const isDeleted = deleteArticle(req.params.id)
        .then(data => {
            if (data) {
                console.log('DELETED')
                res.redirect('/dashboard');
            } else {
                // TODO: alert error while DELETION
            }
        })
        .catch(err => {
            console.log(err);
            // TODO: alert error while DELETION
        })
});


//@desc show EDIT article page
//route GET /article/edit/:id
router.get('/edit/:id', ensureAuth, (req, res) => {
    renderEditArticle(req.params.id, res);
})

//@desc process EDIT article page
//route PUT /article/edit/:id
router.put('/edit/:id', ensureAuth, upload.single('cover-image'), (req, res) => {
    let updatedArticle = {}
    //check if req.body is empty
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        console.log('no data passed', req.body)
    } else {


        updatedArticle = {
            status: req.body.status,
            title: req.body.title,
            // cover_image: req.body.cover_image,
            body: {
                text: req.body.text
            }
        }
        //check if image is updated
        if (req.file) {
            updatedArticle.cover_image = req.file.filename;
            //delete old image
        }
    }
    const result = getArticleById(req.params.id);
    result
        .then((article) => {
            // found
            if (!article) {
                // not found 
                console.log('article not found');
            } else {
                //check if logged user is creator
                if (req.user._id.equals(article.user)) {
                    //update
                    const isUpdated = updateArticle(req.params.id, updatedArticle);
                    isUpdated
                        .then(status => {
                            if (status) {
                                // TODO: Log updated message

                                //check if image is updated
                                if (updatedArticle.cover_image) {
                                    //old image file path
                                    let filePath = `./public/uploads/images/${article.cover_image}`
                                    //delete old image from server
                                    fs.unlink(filePath, (err) => {
                                        if (err) {
                                            console.log('error while deleting cover image from server', err);
                                        }
                                    })
                                }
                            }
                            else {
                                // TODO: log Failure message
                            }
                        })
                        .catch(err => {
                            // TODO: log Failure message
                        })
                    res.redirect('/dashboard');
                } else {
                    //user is not the creator
                    //TODO: Alert
                    console.log('Unautherised');
                }
            }

        })
        .catch(err => {
            //article not found
            console.log('render error', err)
        })
})

//********PUBLIC ROUTES************* */

//@desc send article data for rendering post view
//@route GET /article/data/:id
router.get('/data/:id', ensureAuth, (req, res) => {
    const result = getArticleById(req.params.id);
    result
        .then((article) => {
            if (article) {
                //article found
                const data = {
                    editorData: article.body,
                    status: 1
                }
                res.send(data)
            } else {
                // no article foound with that id
                // render error
                const data = {
                    status: 0
                }
                res.send(data)
            }
        })
})


//@desc show article with id
// route GET / article /: id
router.get('/:id', (req, res) => {
    //TODO: validate req.params.id
    renderArticle(req.params.id, res)
});



module.exports = router;