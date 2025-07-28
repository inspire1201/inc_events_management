const multer = require('multer');

// Using memoryStorage as Cloudinary will directly handle the buffer
const uploadCloud = multer({ storage: multer.memoryStorage() });

module.exports = uploadCloud;