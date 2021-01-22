const router = require('express').Router();


//@desc get all comments of a article
//@route GET /comments/:id      TODo: replace comment with api and marge with api route(api/comments/: id)
router.get('/:id', (req, res) => {
    console.log(req.params.id);
    res.send("Comments")
})

//@desc post a single comment
//@route POST /comments/:id
router.post('/:id', (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    res.send("post req received")
})

//@desc edit a single comment
//@route PUT /comments/:id
router.put('/:id', (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    res.send("put req received")
})

//@desc delte a single comment
//@route Delete /comments/:id
router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    res.send("delete req received")
})

module.exports = router;