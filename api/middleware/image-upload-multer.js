const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    // accept a file
    cb(null, true);
  } else {
    // reject a file
    // cb(null, false); // Does not throw an error
    cb(new Error('Invalid file type, please only upload jpg, jpeg and png files'), true) // Throws an error
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024*1024*5 // 5 megs max
  },
  fileFilter: fileFilter
});

module.exports = (
  multer,
  storage,
  fileFilter,
  upload
)
