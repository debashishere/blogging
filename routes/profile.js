const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');

//@desc protected profile
//route /profile
router.get('/', ensureAuth, (req, res) => {

    //show all post for the user
    res.render('profile/profile', {
    })
})



module.exports = router;