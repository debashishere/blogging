const router = require('express').Router();
const { renderHome, renderAbout, renderContact, renderSearchResult } = require('../controller/render')
const { search, getPublicArticles } = require('../controller/services')
const random = require('random')

const searchResults = {}

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
        // get search result
        const searchTerm = req.query.term;
        const doc = await search(searchTerm)

        //push into cache
        const searchId = random.int(min = 0, max = 500)
        searchResults[`${searchId}`] = doc;

        if (doc) {
            res.send({
                id: searchId
            })
        } else {
            res.send(false);
        }

    }
    catch (err) {
        res.send(false);
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