const fs = require("fs");
const path = require("path");
const upload = require("../../MiddleWare/multer");
const UPLOAD_DIR = "C:/uploads/training-pdfs";
const BASE_UPLOAD_DIR = "C:/uploads/faculity-document";
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

const uploadFaculityDocuments = (req, res) => {
  try {
    const files = req.files;

    const { document_id, department_id, uploaded_by } = req.body;

    //  VALIDATION
    if (!document_id) {
      return res.status(400).json({
        success: 0,
        message: "document_id is required",
      });
    }

    if (!department_id) {
      return res.status(400).json({
        success: 0,
        message: "department_id is required",
      });
    }

    if (!uploaded_by) {
      return res.status(400).json({
        success: 0,
        message: "uploaded_by (faculty_id) is required",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: 0,
        message: "No PDF uploaded",
      });
    }

    // CREATE FOLDER STRUCTURE
    const facultyDir = path.join(BASE_UPLOAD_DIR, String(uploaded_by));
    const deptDir = path.join(facultyDir, String(department_id));
    const docDir = path.join(deptDir, String(document_id));

    [facultyDir, deptDir, docDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const uploadedFiles = [];

    files.forEach((file) => {
      if (file.mimetype !== "application/pdf") return;

      const destPath = path.join(docDir, file.filename);

      fs.renameSync(file.path, destPath);

      uploadedFiles.push({
        file_name: file.filename,
        original_name: file.originalname,
        file_path: destPath,
      });
    });

    return res.status(200).json({
      success: 1,
      message: "PDF uploaded successfully",
      count: uploadedFiles.length,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error("uploadFaculityDocuments error:", error);
    return res.status(500).json({
      success: 0,
      message: "Something went wrong",
    });
  }
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
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({
      success: 0,
      message: "Filename required",
    });
  }

  // Prevent path traversal attack
  const filePath = path.join(UPLOAD_DIR, path.basename(filename));

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({
        success: 0,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: 1,
      message: "File deleted successfully",
    });
  });
};

module.exports = {
  uploadTrainingPDF,
  deleteUploadFile,
  getExistingFiles,
  uploadFaculityDocuments,
};
