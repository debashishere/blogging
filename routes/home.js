const router = require('express').Router();
const { renderHome, renderAbout, renderContact } = require('../controller/render')

//@desc show Home page
//@router GET /
router.get("/", (req, res) => {
    renderHome(req, res);
});

//@desc show About page
//@router GET /about
router.get("/about", (req, res) => {
    renderAbout(req, res);
});

//@desc show Contact page
//@router GET /contact
router.get("/contact", (req, res) => {
    renderContact(req, res);
})


module.exports = router;