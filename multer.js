const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./upload")
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
})

/**FILE TYPE */
/**LOADING... */

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3, //3mb
    },
});

module.exports = upload;
