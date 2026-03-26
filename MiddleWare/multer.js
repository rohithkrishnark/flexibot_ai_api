// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')

// // Ensure directory exists
// const uploadDir = 'C:/uploads/training-pdfs'
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true })
// }

// // Storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir)
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// })

// // File filter (PDF only)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'application/pdf') {
//     cb(null, true)
//   } else {
//     cb(new Error('Only PDF files allowed'), false)
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter
// })

// module.exports = upload

// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// /**
//  * Create a multer upload middleware dynamically
//  * @param {string} uploadDir - directory to save files
//  * @param {Array} allowedMimeTypes - list of allowed mimetypes
//  * @param {number} maxFiles - max number of files (optional)
//  */
// const createUpload = (uploadDir, allowedMimeTypes = [], maxFiles = 1) => {
//   // Ensure directory exists
//   if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//   // Storage config
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, uniqueSuffix + path.extname(file.originalname));
//     },
//   });

//   // File filter
//   const fileFilter = (req, file, cb) => {
//     if (allowedMimeTypes.length === 0 || allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(", ")}`), false);
//     }
//   };

//   return multer({ storage, fileFilter });
// };

// module.exports = createUpload;

// MiddleWare/multer.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * createUpload(folderPath, allowedTypes, maxCount)
 * @param {string} folderPath - Path where files should be stored
 * @param {Array} allowedTypes - MIME types allowed
 * @param {number} maxCount - optional, not used here but can limit files
 * @returns multer instance
 */
const createUpload = (folderPath, allowedTypes = [], maxCount = 10) => {
  // Ensure directory exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, folderPath),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.length === 0 || allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = createUpload;
