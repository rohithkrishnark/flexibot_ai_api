const fs = require("fs");
const path = require("path");
const upload = require("../../MiddleWare/multer");
const UPLOAD_DIR = "C:/uploads/training-pdfs";

/**
 * UPLOAD PDF FILES
 */
const uploadTrainingPDF = (req, res) => {
  upload.array("files", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
    }));

    res.status(200).json({
      success: 1,
      message: "PDF uploaded successfully",
      files,
    });
  });
};

/**
 * GET EXISTING FILES
 */
const getExistingFiles = (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: "Unable to read upload directory",
      });
    }

    // filter only PDF files
    const pdfFiles = files
      .filter((file) => file.toLowerCase().endsWith(".pdf"))
      .map((file, index) => ({
        id: index + 1,
        name: file,
        filename: file,
      }));

    //  NO FILES FOUND
    if (pdfFiles.length === 0) {
      return res.status(200).json({
        success: 2,
        message: "No files found",
        data: [],
      });
    }

    //  FILES EXIST
    return res.status(200).json({
      success: 1,
      message: "Files fetched successfully",
      data: pdfFiles,
    });
  });
};

/**
 * DELETE PDF FILE (FROM C DRIVE)
 */
const deleteUploadFile = (req, res) => {
  const { filename } = req.body

  if (!filename) {
    return res.status(400).json({
      success: 0,
      message: 'Filename required',
    })
  }

  // Prevent path traversal attack
  const filePath = path.join(UPLOAD_DIR, path.basename(filename))

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({
        success: 0,
        message: 'File not found',
      })
    }

    res.status(200).json({
      success: 1,
      message: 'File deleted successfully',
    })
  })
}

module.exports = {
  uploadTrainingPDF,
  deleteUploadFile,
  getExistingFiles,
};
