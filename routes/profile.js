const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');

//@desc protected profile
//route /profile
router.get('/', ensureAuth, (req, res) => {
    console.log('session', req.session)
    res.render('profile', {
    })
})



module.exports = router;