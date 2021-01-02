const router = require('express').Router();
const passport = require('passport');
const { ensureAuth } = require('../middleware/auth');

//auth routes
//@desc Auth with google
//@route /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//@desc google auth callback
//@route /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        //auth successfull
        //redirect
        console.log('success');
        res.redirect('/profile');
    }
);

//@desc Logout User
//@route /auth/logout
router.get('/logout', ensureAuth, (req, res) => {
    req.logOut();
    res.clearCookie("user_session_id");
    res.redirect('/');
})





module.exports = router;