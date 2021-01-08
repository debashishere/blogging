const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const Article = require('../model/Article');
const path = require('path');

//controller fumctions
const { renderCreateArticle, renderArticle, renderEditArticle, renderPublicArticle } = require('../controller/render');
const { createNewArticle, deleteArticle, getArticleById, updateArticle } = require('../controller/services');

//to store and retrive image in mongodb
const fs = require('fs');
const multer = require('multer');

//define storage for image
const storage = multer.diskStorage({
    //destinatoin for files
    destination: function (req, file, callback) {
        callback(null, './public/uploads/images')
    },

    //add back the extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldsSize: 1024 * 1024 * 3 // max image size 3mb
    },
});

//********PUBLIC ROUTES************* */

//@desc show public article page
//@route GET /article
router.get('/', (req, res) => {
    renderPublicArticle(req, res);
});


//*******************SECURE ROUTES**************** */

//@desc show create article page
//@route GET /article/new
router.get('/new', ensureAuth, (req, res) => {
    renderCreateArticle(req, res);
});

//@desc process create blog
//@route POST /article/new
router.post('/new', ensureAuth, upload.single('cover-image'), async (req, res) => {
    const article = createNewArticle(req);
    article
        .then(isArticle => {
            //check if article is created
            if (isArticle) {
                res.redirect('/dashboard');
                // TODO: Alert created message
            }
            else {
                //TODO: render error
            }
        })
        .catch(err => {
            console.log(err);
            //Handle Error
        })

});

//@desc show article with id
//route GET /article/:id
router.get('/:id', ensureAuth, (req, res) => {
    renderArticle(req.params.id, res)
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


module.exports = router;