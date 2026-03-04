const {
  insertAluminiDetail,
  FetchAllAluminiDetail,
  FetchAllAluminiDetailById,
  UpdateAluminiDetail,
  InactiveAluminiDetail,
  sendAluminimail,
  insertDepartmentDetail,
  getDepartmentDetil,
  updateDepdetail,
  insertProgramMasterDetail,
  updateProgramMasterDetail,
  getProgramMasterDetail,
  createDesignation,
  fetchDesignation,
  editDesignation,
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

/**
 *
 * MASTER SECITON COMES BELOW IT
 *
 */

//DEPARTMENT MASTER
router.post("/department/insert", insertDepartmentDetail);
router.post("/department/update", updateDepdetail);
router.get("/department/get", getDepartmentDetil);

router.post("/program/insert", insertProgramMasterDetail);
router.post("/program/update", updateProgramMasterDetail);
router.get("/program/get", getProgramMasterDetail);

router.post("/designation/create", createDesignation);
router.get("/designation/get", fetchDesignation);
router.post("/designation/update", editDesignation);

module.exports = router;
