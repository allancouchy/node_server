const multer = require('multer')

// declare extensions to support them
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

// define max size
var maxSize = 1 * 1000 * 1000

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    // replace spaces with an underscore
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]
    // rename the file
    callback(null, name + Date.now() + '.' + extension)
  },
  onFileUploadStart: (req, file, res) => {
    if (req.files.file.length > maxSize) {
      return false
    }
  },
})

module.exports = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single('image')
