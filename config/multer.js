const multer = require('multer');



//************************MUlTER********************** */

//define storage for cover image image
const coverStorage = multer.diskStorage({
    //destinatoin for files
    destination: function (req, file, callback) {

        callback(null, './public/uploads/cover-images')
    },

    //add back the extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});



//upload parameters for multer (cover-images)
const coverUpload = multer({
    storage: coverStorage,
    limits: {
        fieldsSize: 1024 * 1024 * 3 // max image size 3mb
    },
});

module.exports.coverUpload = coverUpload;