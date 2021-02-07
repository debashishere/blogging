const path = require('path');

//render views

module.exports = {
    //@desc render Search result page

    renderSearchResult: (res, searchData) => {
        console.log('data', searchData)
        res.render('search_result', {
            layout: 'main',
            header_style: 'header.css',
            header_js: "header.js",
            footer_style: 'footer.css',
            style: 'search_result.css',
            searchData: searchData,
        })
    },


    //@desc render home page
    renderHome: (res, articles, loggedUser) => {
        res.render('home', {
            layout: 'main',
            js: 'home.js',
            header_js: "header.js",
            style: 'home.css',
            header_style: 'header.css',
            articles,
            loggedUser,
        })


    },

    //@desc render about view
    renderAbout: (req, res) => {
        res.render('about', {
            layout: 'main',
            header_js: "header.js",
            style: 'about.css',
            header_style: 'header.css',
            footer_style: 'footer.css',
            loggedUser: req.user
        })
    },

    //@desc render contact view
    renderContact: (req, res) => {
        res.render('contact', {
            layout: 'main',
            header_js: "header.js",
            style: 'contact.css',
            header_style: 'header.css',
            footer_style: 'footer.css',
        })
    },

    //@desc render profile view
    renderProfile: (res, articleList, postCount, loggedUser) => {
        res.render('profile/profile', {
            layout: 'main',
            style: "profile.css",
            header_style: 'header.css',
            footer_style: 'footer.css',
            header_js: "header.js",
            loggedUser,
            articleList,
            postCount,
        })
    },


    //@desc render dashboard view
    renderDashboard: (res, articleList, postCount, reactionCount) => {
        res.render('dashboard/dashboard', {
            style: "dashboard.css",
            header_style: "header.css",
            header_js: "header.js",
            footer_style: 'footer.css',
            articles: articleList,
            postCount,
            reactionCount,
        })
    },

    //@desc render add article view
    renderCreateArticle: (req, res) => {
        res.render('articles/add_article', {
            style: 'add_article.css',
            js: 'add_article.js',
            editor: true,
        })

    },

    //@desc render a single article view
    renderArticle: (loggedUser, article, comments, res) => {
        res.render('articles/article', {
            style: "article.css",
            api_js: "api_transactions.js",
            js: 'article.js',
            comment_js: "comment.js",
            header_style: "header.css",
            header_js: "header.js",
            footer_style: 'footer.css',
            sheet_01: 'article_discussion.css',
            editor: true,
            article,
            comments,
            user: loggedUser
        })

    },

    //@desc render edit article view
    renderEditArticle: (id, res) => {
        res.render('articles/add_article', {
            style: 'add_article.css',
            js: "edit_article.js",
            api_js: "api_transactions.js",
            editor: true,
            edit: true,
        })
    },

    //@desc render edit comment view
    renderEditComment: (comment, res) => {
        res.render('articles/edit_comment', {
            style: "edit_comment.css",
            header_style: "header.css",
            header_js: 'header.js',
            footer_style: 'footer.css',
            js: "edit_comment.js",
            user: res.locals.loggedUser,
            comment,
        });
    }
}