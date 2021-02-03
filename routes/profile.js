const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const { getPublicAticlesByUser } = require('../controller/services');

//controller functions
const { renderProfile } = require('../controller/render');

//@desc protected profile
//route /profile
router.get('/', ensureAuth, async (req, res) => {
    try {
        // access logged user from globals
        const loggedUser = res.locals.loggedUser || null
        //check if user is set
        if (loggedUser) {
            //get user articles
            const articles = await getPublicAticlesByUser(loggedUser._id)
                .then(articleList => {
                    // if no articles available
                    if (!articleList) {
                        articleList = []
                    }
                    const postCount = articleList.length
                    renderProfile(res, articleList, postCount, loggedUser);
                })
                .catch(err => {
                    //render error
                })
        }
    }
    catch (err) {
        //render error
    }
})



module.exports = router;