const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set storage engine - uploads go straight to S3 instead of local disk
const storage = multerS3({
  s3,
  bucket: process.env.AWS_S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // Only set an ACL if one is configured - buckets with "Bucket owner enforced"
  // object ownership (the modern S3 default) reject ACLs entirely.
  ...(process.env.AWS_S3_ACL ? { acl: process.env.AWS_S3_ACL } : {}),
  key: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 * 1024 }, // 1 GB limit
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 },  // Support image and document upload in the file field
  { name: 'video', maxCount: 5 },
  { name: 'gallery_images', maxCount: 200 }
]); // Support both image and video upload

// Check file type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|webp|gif|pdf|doc|docx|mp4|mov|wmv|avi/; // Added video file types
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images, Videos, PDFs, and Word Documents Only!');
  }
}

module.exports = upload;
