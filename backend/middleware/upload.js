// const multer = require('multer');

// const uploadCloud = multer({ storage: multer.memoryStorage() });

// module.exports = uploadCloud;
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;

