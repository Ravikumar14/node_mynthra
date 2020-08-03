const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/uploads")

    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)

    }
})
module.exports = { storage }