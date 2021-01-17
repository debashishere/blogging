const router = require('express').Router();
const { ensureAuth } = require('../middleware/auth');

//cache processes
const { processEditorImageCache, processUploadCoverCache,
    processUpdateCoverCache } = require('../controller/process/cache');


//multor config functions
const { upload, coverUpload } = require('../config/multer');

//@desc Upload image with editor js
//@route POST /upload/new/image
router.post('/new/image', ensureAuth, upload.single('cover-image'), (req, res) => {
    const resData = processEditorImageCache(req.file.filename);
    res.send(resData)
})

//@desc Upload post's cover-image 
//@route POST /upload/new/cover/:id
router.post('/new/cover/:id', ensureAuth, coverUpload.single('cover_image'), (req, res) => {
    // upload image and push to cache storage,
    const resData = processUploadCoverCache(req.user, req.file);
    res.send(resData);
})

//@desc Update post's cover-image 
//@route POST /upload/update/cover/:id
router.post('/update/cover/:id', ensureAuth, coverUpload.single('cover_image'), (req, res) => {
    const resData = processUpdateCoverCache(req.user, req.file)
    res.send(resData);
})

module.exports = router;