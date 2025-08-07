const multer = require('multer');

const uploadCloud = multer({ storage: multer.memoryStorage() });

module.exports = uploadCloud;