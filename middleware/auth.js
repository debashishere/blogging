module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }
    },
    ensureApiAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(401).send('UnAutherised');
        }
    }
}