const router = require('express').Router();

//@desc protected profile
//route /profile
router.get('/', (req, res) => {
    res.render('profile', {
    })
})



module.exports = router;