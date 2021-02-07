const router = require('express').Router();
const { ensureApiAuth } = require('../middleware/auth');


//multor config functions
const { coverUpload } = require('../config/multer');

//@desc Upload post's cover-image 
//@route POST api/upload/new/cover/:id
router.post('/new/cover/:id', ensureApiAuth, coverUpload.single('cover_image'), (req, res) => {

    const user = req.user
    const file = req.file
    const imageData = {
        user: user.id,
        filename: file.filename,
        path: '/uploads/cover-images/' + file.filename
    }
    coverImages.push(imageData)
    const resData = {
        path: imageData.path
    }
    res.status(201).send(resData);

})

//@desc Update post's cover-image 
//@route POST api/upload/update/cover/:id
router.post('/update/cover/:id', ensureApiAuth, coverUpload.single('cover_image'), (req, res) => {

    const user = req.user
    const file = req.file
    const imageData = {
        user: user.id,
        filename: file.filename,
        path: '/uploads/cover-images/' + file.filename
    }
    //push to global
    updatedCoverImages.push(imageData)
    const resData = {
        path: imageData.path
    }
    res.status(201).send(resData);

})

module.exports = router;