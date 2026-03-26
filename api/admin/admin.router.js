const createUpload = require("../../MiddleWare/multer");
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
  insertProgramMasterYear,
  updateProgramMasterYear,
  getProgramMasterYear,
  insertUserGroupMaster,
  updateUserGroupMaster,
  getUserGroupMaster,
  RegisterFaculty,
  getAllFaculity,
  ApproveFaculity,
  ApproveFacLoginDtl,
  getProgramMasterYearById,
} = require("./admin.controller");
const {
  uploadTrainingPDF,
  deleteUploadFile,
  getExistingFiles,
} = require("./Upload");

const router = require("express").Router();
const pdfUpload = createUpload(
  "C:/uploads/training-pdfs",
  ["application/pdf"],
  10,
);

// Call multer in the route, controller only handles the uploaded files
router.post("/upload", pdfUpload.array("files", 10), uploadTrainingPDF);

router.delete("/delete", deleteUploadFile);
router.get("/existing", getExistingFiles);

router.post("/alumini/insert", insertAluminiDetail);
router.get("/alumini/fetchall", FetchAllAluminiDetail);
router.post("/alumini/fetchallbyid", FetchAllAluminiDetailById);
router.post("/alumini/update/:id", UpdateAluminiDetail);
router.post("/alumini/inactive", InactiveAluminiDetail);

router.post("/alumini/send-login", sendAluminimail);

router.post("/faculty/registration", RegisterFaculty);
router.get("/faculty/fetchall", getAllFaculity);

router.post("/faculty/approve", ApproveFaculity);
router.post("/faculty/activefac", ApproveFacLoginDtl);

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

router.post("/program-detail/insert", insertProgramMasterYear);
router.post("/program-detail/update", updateProgramMasterYear);
router.get("/program-detail/get", getProgramMasterYear);
router.get("/program-detail/get/:id", getProgramMasterYearById);

router.post("/group/insert", insertUserGroupMaster);
router.post("/group/update", updateUserGroupMaster);
router.get("/group/get", getUserGroupMaster);

module.exports = router;
