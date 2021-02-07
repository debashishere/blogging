const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const { getPublicAticlesByUser } = require('../controller/services');
//controller functions
const { renderProfile } = require('../controller/render');


//@desc get protected profile
//@route GET /profile
router.get('/', ensureAuth, async (req, res) => {

    try {
        const loggedUser = res.locals.loggedUser || null
        if (loggedUser) {
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