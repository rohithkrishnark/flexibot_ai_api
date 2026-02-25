const {
  insertAluminiDetail,
  FetchAllAluminiDetail,
  FetchAllAluminiDetailById,
  UpdateAluminiDetail,
  InactiveAluminiDetail,
  sendAluminimail,
} = require("./admin.controller");
const {
  uploadTrainingPDF,
  deleteUploadFile,
  getExistingFiles,
} = require("./Upload");

const router = require("express").Router();

router.post("/upload", uploadTrainingPDF);
router.delete("/delete", deleteUploadFile);
router.get("/existing", getExistingFiles);

router.post("/alumini/insert", insertAluminiDetail);
router.get("/alumini/fetchall", FetchAllAluminiDetail);
router.post("/alumini/fetchallbyid", FetchAllAluminiDetailById);
router.post("/alumini/update/:id", UpdateAluminiDetail);
router.post("/alumini/inactive", InactiveAluminiDetail);

router.post("/alumini/send-login", sendAluminimail);

module.exports = router;
