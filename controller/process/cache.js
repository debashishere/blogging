module.exports = {
    // editor push images to cache
    processEditorImageCache: function (filename) {
        articleImages.push(filename)

        //res for editor js
        const data = {
            "success": 1,
            "file": {
                "url": `http://localhost:3000/uploads/images/${req.file.filename}`
            }
        }
        return data;
    },

    // push upload cover to the cash
    processUploadCoverCache: function (user, file) {
        const imageData = {
            user: user.id,
            filename: file.filename,
            path: '/uploads/cover-images/' + file.filename
            // cover_image: req.file
        }
        coverImages.push(imageData)
        console.log('cover images', coverImages)
        //set status 1 if everything fine
        return {
            status: 1,
            path: imageData.path
        }
    },

    // update cover image 
    processUpdateCoverCache: function (user, file) {
        // upload image and push to cache storage,
        const imageData = {
            user: user.id,
            filename: file.filename,
            path: '/uploads/cover-images/' + file.filename
            // cover_image: req.file
        }
        //push to cache
        updatedCoverImages.push(imageData)
        console.log('cover images', updatedCoverImages)
        //set status 1 if everything fine
        return {
            status: 1,
            path: imageData.path
        }
    },

    //create aticle with images
    processCreateArticleCache: function (user, article) {
        //verify for filter
        function verifyUser(data) {
            return data.user === user.id
        }
        // pull cover image with userid from cache
        const coverImageData = coverImages.filter(verifyUser);
        console.log('coverImageData', coverImageData);

        let newArticle = {
            title: article.title,
            cover_image: coverImageData[0].filename,
            body: article.editorData,
            status: article.status.toLowerCase(),
            user: user._id,
        }

        return newArticle;
    },

    // update article with images
    processUpdateArticleCache: function (user, article) {
        //verify for filter
        function verifyUser(data) {
            return data.user === user.id
        }

        let updatedArticle = {
            title: article.title,
            body: article.editorData,
            status: article.status.toLowerCase(),
        }

        //check if cover image is updated
        // pull cover image with userid from cache
        if (updatedCoverImages.length > 0) {
            const coverImageData = updatedCoverImages.filter(verifyUser);

            //set updated cover image
            updatedArticle.cover_image = coverImageData[0].filename
        }
        return updatedArticle;
    },
}