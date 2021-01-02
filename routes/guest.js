const router = require('express').Router();


//Public routes
//@desc home page
//@route /
router.get("/", (req, res) => {
    res.render('home', {
        layout: 'main',
        js: 'home.js',
        style: 'home.css'
    })
});



module.exports = router;