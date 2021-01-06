const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const Article = require('../model/Article');

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


//@desc show create blog page
//@route GET /article/new
router.get('/new', ensureAuth, (req, res) => {
    res.render('articles/add_article', {
        style: 'add_article.css'

    })
})

//@desc process create blog
//@route POST /article/new
router.post('/new', upload.single('cover-image'), ensureAuth, async (req, res) => {
    try {
        // console.log(req.file);
        const newArticle = new Article({
            title: req.body.title,
            cover_image: req.file.filename,
            body: {
                text: req.body.body,
            },
            status: req.body.status,
            user: req.user._id,

        })

        newArticle
            .save()
            .then(data => {
                // console.log('data', data)
                if (data) {
                    console.log('article created successfully', data); //TODO: alert created
                }
            })
            .catch(err => {
                console.log(err);
            })

        //redirect to profile
        res.redirect('/profile')
    }
    catch (err) {
        console.error(err);
        // alet error while create the post
        res.redirect('/profile');
    }
})

//@desc show article with id
//route /article/:id
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id, (err, data) => {
            if (err) {
                //handle error
            }
            // console.log('data', data);
            res.render('articles/article', {
                title: data.title
            })
        })
    }
    catch (err) {
        console.log(err);
    }

})


module.exports = router;