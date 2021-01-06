const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const Article = require('../model/Article');

//controller fumctions
const { renderCreateArticle, renderArticle } = require('../controller/render');
const { createNewArticle } = require('../controller/services');

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
})


//@desc show create article page
//@route GET /article/new
router.get('/new', ensureAuth, (req, res) => {
    renderCreateArticle(req, res);
})

//@desc process create blog
//@route POST /article/new
router.post('/new', upload.single('cover-image'), ensureAuth, async (req, res) => {
    const article = createNewArticle(req);
    article
        .then(isArticle => {
            //check if article is created
            if (isArticle) {
                res.redirect('/profile');
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

})

//@desc show article with id
//route /article/:id
router.get('/:id', (req, res) => {
    renderArticle(req.params.id, res)
})


module.exports = router;