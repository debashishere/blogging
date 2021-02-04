const { createNewArticle, getArticleById, updateArticle, deleteArticle, deleteArticleComment } = require('../services');
const fs = require('fs');

//@desc delete image with name
const deleteServerImage = function (fileName) {
    let filePath = `./public/uploads/cover-images/${fileName}`
    //delete old image from server (not working)
    console.log('delete', filePath)
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log('error while deleting cover image from server', err);
        }
    })
}

module.exports = {
    //@desc create new article into db
    processCreateArticleDb: async function (newArticle) {
        try {
            //craete article in db
            const isArticle = await createNewArticle(newArticle);
            if (isArticle) {
                // delete cover images except the new artilces cover image
                coverImages.forEach(data => {
                    if (newArticle.cover_image != data.filename) {
                        deleteServerImage(data.filename)
                    }
                })
                coverImages = []
                //send status 1 if everything is fine
                return { status: 1 }
            } else {
                //TODO: render error
                return { status: 0 }
            }
        }
        catch (err) {
            console.log(err)
            return { status: 0 }
        }

    },

    //@desc get single article by id from  db
    processGetArticleDataDb: async function (articleId) {
        try {
            const article = await getArticleById(articleId);
            if (article) {
                //article found
                const data = {
                    editorData: article.body,
                    title: article.title,
                    cover_image_path: '/uploads/cover-images/' + article.cover_image,
                    status: article.status,
                    req_status: 1
                }
                return data;
            } else {
                // no article foound with that id
                // render error
                const data = {
                    req_status: 0
                }
                return data;
            }

        }
        catch (err) {
            console.log(err);
            const data = {
                req_status: 0
            }
            return data;
        }
    },

    //@desc update single article by id in db
    processUpdateArticleDb: async function (updatedArticle, articleId, userId) {
        try {
            //find updated article in db
            const article = await getArticleById(articleId);
            if (!article) {
                // not found 
                console.log('article not found');
                return { status: 0 }
            } else {
                //article found
                //check if logged user is creator
                if (userId.equals(article.user._id)) {
                    //update
                    const isUpdated = await updateArticle(articleId, updatedArticle);

                    if (isUpdated) {
                        //updated

                        //check if image is updated
                        if (updatedArticle.cover_image) {
                            //delete old cover image
                            deleteServerImage(article.cover_image);

                            //delete all images uploaded while updating except new articles one
                            updatedCoverImages.forEach(data => {
                                if (data.filename != updatedArticle.cover_image) {
                                    deleteServerImage(data.filename);
                                }
                            })
                        }



                        return { status: 1 }
                    } else {
                        //not updated
                        // TODO: log Failure message
                        return { status: 0 }
                    }
                } else {
                    //user is not the creator
                    //TODO: Alert
                    console.log('Unautherised');
                    return { status: 0 }
                }
            }

        }
        catch (err) {
            console.log(err);
            return { status: 0 }
        }

    },

    //@desc delete single article from db
    processDeleteArticleDb: async function (articleId) {
        try {
            const deletedArticle = await deleteArticle(articleId);
            if (deletedArticle) {
                //delete all comments 
                await deleteArticleComment(articleId);

                //delete cover image
                deleteServerImage(deletedArticle.cover_image)
                return true;
            } else {
                return false;
            }
        }
        catch (err) {
            console.log(err)
            return false;
        }
    },

    //*******************************COMMENT AND REPLY*************************/
}