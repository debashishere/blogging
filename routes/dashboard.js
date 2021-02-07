const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');
const { getAticlesByUser } = require('../controller/services');
//render controller functions
const { renderDashboard } = require('../controller/render');


//*******************PROTECTED ROUTE*************** */

//@desc render personalised dashboard
//@route /dashboard
router.get('/', ensureAuth, async (req, res) => {

    try {
        const loggedUser = res.locals.loggedUser || null
        const articles = await getAticlesByUser(loggedUser._id)
            .then(articleList => {
                // if no articles available
                if (!articleList) {
                    articleList = []
                }
                let reactionCount = 0;
                articleList.forEach(article => {
                    reactionCount = reactionCount + article.reactionCount
                })

                const postCount = articleList.length
                renderDashboard(res, articleList, postCount, reactionCount);
            })
    }

    catch (err) {
        //render error
    }

})


module.exports = router;