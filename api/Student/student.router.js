const router = require("express").Router();

const createUpload = require("../../MiddleWare/multer");
const { uploadFaculityDocuments } = require("../admin/Upload");
const {
  insertStudentDetail,
  getAllStudents,
  getStudentById,
  updateStudentDetail,
  inactiveStudent,
  batchStudentDetail,
  StudentLogin,
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  createActivityController,
  // getAllActivityDetail,
  connectUser,
  getMyConnections,
  getLoggedStudentDetail,
  EditStudentBio,
  EditSkills,
  getAllTotalStudents,
  getallActivityDetail,
  getAllStudentFullActivity,
  getAllActivityDetail,
  giveActivityScore,
  rejectActivity,
  insertFacDocuments,
  getDocumentsByUploadedByController,
  getAllDepartmentDocuments,
} = require("./student.controller");
const {
  uploadPostMedia,
  getPostMedia,
  deletePostMedia,
  getAllStudentPostDetail,
  uploadStudentActivity,
  getAllStudentActivities,
  uploadProfilePicture,
  getMyProfilePhoto,
  getAllStudentsActivities,
  getFaculityDocumentsByFaculty,
  getAllFaculityDocuemntDetailByDep
} = require("./StudentUpload");

// Images/videos allowed
const mediaUpload = createUpload(
  "C:/uploads/student-posts",
  ["image/jpeg", "image/png", "image/jpg", "video/mp4"],
  1,
);

const activityUpload = createUpload(
  "C:/uploads/student-activity",
  ["image/jpeg", "image/png", "image/jpg", "video/mp4"],
  1,
);

const studentProfile = createUpload(
  "C:/uploads/student-profile",
  ["image/jpeg", "image/png", "image/jpg", "video/mp4"],
  1,
);

const pdfUpload = createUpload(
  "C:/uploads/faculity-document",
  ["application/pdf"],
  10,
);

// Insert
router.post("/insert", insertStudentDetail);

//FACULITY
router.post(
  "/upload-document",
  pdfUpload.array("files", 10),
  uploadFaculityDocuments,
);

router.post("/insert-fac-documents", insertFacDocuments);
router.post("/documents/by-user", getDocumentsByUploadedByController);

router.post("/documents/by-dep", getAllDepartmentDocuments);

// Fetch all
router.post("/all", getAllStudents);

router.get("/totalstudents", getAllTotalStudents);

// Fetch single
router.get("/:id", getStudentById);
// Update
router.post("/update", updateStudentDetail);
router.post("/inactive", inactiveStudent);
router.post("/batchstudent", batchStudentDetail);

router.post("/stdlogin", StudentLogin);

// Upload post (caption, description, media)
router.post("/create", createPost);

// Fetch all posts
router.post("/allpost", getAllPosts);

// Fetch single post by ID
router.get("/:id", getPostById);

// Delete post
router.post("/delete", deletePost);

// Upload media for a post
router.post("/upload", mediaUpload.single("media"), uploadPostMedia);

// Get all media files of a post
router.get("/media/:postId", getPostMedia);

router.get("/fullmedia/:StdId", getAllStudentPostDetail);

// Delete media file of a post
router.post("/delete", deletePostMedia);

router.post("/activity/create", createActivityController);

router.post(
  "/activity/upload",
  activityUpload.single("media"),
  uploadStudentActivity,
);

router.post("/activity/allpost", getAllActivityDetail);
// router.get("/activity/media/:activityId", getActivityMedia);
// router.post("/activity/delete", deleteActivityMedia);
router.get("/activity/full/:StdId", getAllStudentActivities);

router.post("/connect-alumini", connectUser);
router.post("/get-connection", getMyConnections);

router.post("/loggedstudentdetail", getLoggedStudentDetail);

router.post("/edit-bio", EditStudentBio);
router.post("/edit-skill", EditSkills);
router.get("/myprofilepic/:StdId", getMyProfilePhoto);

router.post(
  "/profile/upload",
  studentProfile.single("media"),
  uploadProfilePicture,
);

router.get("/documents/faculty/:faculty_id", getFaculityDocumentsByFaculty);

router.get("/activity/allstudent/post", getAllStudentsActivities);
router.post("/activity/getallstudent/detail", getAllStudentFullActivity);

router.post("/activity/givescore", giveActivityScore);
router.post("/activity/reject", rejectActivity);

router.get("/documents/department/:depid", getAllFaculityDocuemntDetailByDep);

module.exports = router;
