const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');

//@desc protected profile
//route /profile
router.get('/', ensureAuth, (req, res) => {
    res.render('profile', {
    })
})



module.exports = router;