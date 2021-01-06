const router = require('express').Router();
const { renderHome } = require('../controller/render')

//@desc show Home page
//@router GET /
router.get("/", (req, res) => {
    renderHome(req, res);
})


module.exports = router;