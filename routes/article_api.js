const router = require('express').Router();

const { ensureAuth } = require('../middleware/auth');
const { processCreateArticleCache, processUpdateArticleCache } = require('../controller/process/cache');
const { processCreateArticleDb, processUpdateArticleDb, processGetArticleDataDb } = require('../controller/process/database');
const { getArticleById } = require('../controller/services');


//@desc process create blog
// @route POST /api/article/new
router.post('/new', ensureAuth, (req, res) => {
    //get a newarticle object
    const newArticle = processCreateArticleCache(req.user, req.body);
    processCreateArticleDb(newArticle)
        .then(status => {
            res.send(status); //TODO: log message
        })
        .catch(err => {
            console.log(err);
        })
});


//@desc Update post
//@route PUT /api/article/upadte/:id
router.put('/update/:id', ensureAuth, (req, res) => {

    const updatedArticle = processUpdateArticleCache(req.user, req.body)
    // update image and push to cache storage,
    processUpdateArticleDb(updatedArticle, req.params.id, req.user._id)
        .then(status => {
            res.send(status);
        })
        .catch(err => {
            console.log(err)
        })
})

//@desc send article data for rendering post view
//@route GET /api/article/data/:id
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

//@desc send article data for edit post view
//@route GET /api/article/edit/data/:id
router.get('/edit/data/:id', (req, res) => {
    processGetArticleDataDb(req.params.id)
        .then(data => {
            res.send(data);
        })
        .catch(data => {
            res.send(data);
        })
})





module.exports = router;