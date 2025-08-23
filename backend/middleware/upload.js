
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit for files (increased for PDFs)
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos and PDFs
    if (
      file.mimetype.startsWith('image/') || 
      file.mimetype.startsWith('video/') || 
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only image, video and PDF files are allowed'), false);
    }
  }
});

module.exports = upload;