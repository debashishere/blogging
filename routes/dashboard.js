const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');

//render controller functions
const { renderDashboard } = require('../controller/render');

//@desc render personalised dashboard
//@route /dashboard
router.get('/', ensureAuth, (req, res) => {
    renderDashboard(req, res);
})


module.exports = router;