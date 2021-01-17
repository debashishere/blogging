const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');

//controller fumctions
const { renderCreateArticle, renderArticle, renderEditArticle } = require('../controller/render');

//db processes
const { processDeleteArticleDb } = require('../controller/process/database');

//*******************SECURE ROUTES**************** */

//@desc show create article page
//@route GET /article/new
router.get('/new', ensureAuth, (req, res) => {
    renderCreateArticle(req, res);
});

//@desc delete article with id
//route DELETE /article/:id
router.delete('/:id', ensureAuth, (req, res) => {
    processDeleteArticleDb(req.params.id)
        .then(status => {
            if (status) {
                res.redirect('/dashboard');
            }
            else {
                console.log("Error while deletion");
                res.redirect('/dashboard');
            }
        })
        .catch(err => {
            console.log(err);
            res.redirect('/dashboard');
        })
})

//@desc show EDIT article page
//route GET /article/edit/:id
router.get('/edit/:id', ensureAuth, (req, res) => {
    renderEditArticle(req.params.id, res);
})


//********PUBLIC ROUTES************* */

//@desc show article with id
// route GET / article /: id
router.get('/:id', (req, res) => {
    //TODO: validate req.params.id
    renderArticle(req.params.id, res)
});



module.exports = router;