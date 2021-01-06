const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');

//controller functions
const { renderProfile } = require('../controller/render');

//@desc protected profile
//route /profile
router.get('/', ensureAuth, (req, res) => {
    renderProfile(res);

})



module.exports = router;