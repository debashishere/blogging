const router = require('express').Router();
const profile = require('./profile');
const dashboard = require('./dashboard');
const article = require('./article');
const auth = require('./auth');
const comments = require('./comment');
const { renderHome, renderAbout, renderContact, renderSearchResult } = require('../controller/render')
const { search, getPublicArticles } = require('../controller/services')
const random = require('random')
const searchResults = {}



//**********************ROUTES******************** */

router.use('/comments', comments)
router.use('/article', article);
router.use('/profile', profile);
router.use('/auth', auth);
router.use('/dashboard', dashboard);



//************************PUBLIC ROUTES****************** */

//@desc show Home page
//@router GET /
router.get("/", async (req, res) => {

    try {
        console.log('req')
        let loggedUser = res.locals.loggedUser || null
        await getPublicArticles()
            .then(articles => {
                renderHome(res, articles, loggedUser);
            })
            .catch(err => {
                console.log(err)
            })

    }

    catch (err) {
        //render error
    }

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

//@desc get Search term
//@route  /serach/term
router.get('/search', async (req, res) => {

    try {
        const searchTerm = req.query.term;
        const doc = await search(searchTerm)
        //push into cache
        const searchId = random.int(min = 0, max = 500)
        searchResults[`${searchId}`] = doc;
        if (doc) {
            res.status(200).send({
                id: searchId
            })
        } else {
            res.status(404).send("Not Found");
        }
    }

    catch (err) {
        res.status(404).send("Not Found");
    }

})

//@desc process search result
//@route GET /search/:id
router.get('/search/:id', (req, res) => {

    const searchId = parseInt(req.params.id);
    //pull search result
    const searchData = searchResults[`${searchId}`];
    renderSearchResult(res, searchData);

})


module.exports = router;