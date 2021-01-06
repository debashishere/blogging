const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const article = require('../model/Article');
const render = require('../controller/render');

//render controller functions
const { renderDashboard } = require('../controller/render');

//@desc show personalised dashboard
//@route /dashboard
router.get('/', ensureAuth, (req, res) => {
    renderDashboard(req, res);
})


module.exports = router;