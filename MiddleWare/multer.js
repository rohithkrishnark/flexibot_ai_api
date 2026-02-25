const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure directory exists
const uploadDir = 'C:/uploads/training-pdfs'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

// File filter (PDF only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter
})

module.exports = upload