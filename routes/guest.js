const router = require('express').Router();


//Public routes
//home page
router.get("/", (req, res) => {
    res.render('home', {
        layout: 'main',
        js: 'home.js',
        style: 'home.css'
    })
})


module.exports = router;