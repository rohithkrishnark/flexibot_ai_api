const createUpload = require("../../MiddleWare/multer");
const {
  insertchatdetail,
  fetchAllActiveAlumini,
  createPost,
  getAllAluminiPost,
  inactivePost,
  EventCreate,
  getAllAluminiEventPost,
  fetchloggedAluminDetail,
  addExperience,
  editExperience,
  getExperience,
  addEducation,
  editEducation,
  getEducation,
  addProfile,
  editProfile,
  getProfileDetail,
  getFullProfile,
  updateAluminiBio,
  getAllAluminiPostDetail,
  getAllAluminiEvents,
} = require("./alumini.controller");
const {
  uploadAluminiPostMedia,
  getAllAlumniniPostDetail,
  uploadAluminiEventMedia,
  getAllAluminiEventDetail,
  uploadAluminiProfilePicture,
  getAluminiProfilePhoto,
  getFullpostMediaDetail,
  getAllAluminiEventsMedia,
} = require("./AluminiUpload");

const router = require("express").Router();

const mediaUpload = createUpload(
  "C:/uploads/alumini-posts",
  ["image/jpeg", "image/png", "image/jpg", "video/mp4"],
  1,
);

const eventUpload = createUpload(
  "C:/uploads/alumini-events",
  ["image/jpeg", "image/png", "image/jpg", "video/mp4"],
  1,
);

const aluminiporfile = createUpload(
  "C:/uploads/alumini-profiles",
  ["image/jpeg", "image/png", "image/jpg", "video/mp4"],
  1,
);

// Insert
router.post("/insert", insertchatdetail);
router.get("/getall", fetchAllActiveAlumini);

router.post("/getsingledetail", fetchloggedAluminDetail);


router.post("/posts/create", createPost);
router.post("/posts/getall", getAllAluminiPost);
router.post("/posts/indactive", inactivePost);

router.get("/post/fullmedia/:AlumId", getAllAlumniniPostDetail);

router.get("/myprofilepic/:AlumId", getAluminiProfilePhoto);

router.post(
  "/posts/upload",
  mediaUpload.single("media"),
  uploadAluminiPostMedia,
);

router.post("/events/create", EventCreate);
router.post("/events/getall", getAllAluminiEventPost);

router.post(
  "/event/upload",
  eventUpload.single("media"),
  uploadAluminiEventMedia,
);

router.get("/event/fullmedia/:AlumId", getAllAluminiEventDetail);

router.post(
  "/profile/upload",
  aluminiporfile.single("media"),
  uploadAluminiProfilePicture,
);

/* ===== EXPERIENCE ===== */
router.post("/experience/insert", addExperience);
router.post("/experience/update", editExperience);
router.get("/experience/:alum_id", getExperience);

/* ===== EDUCATION ===== */
router.post("/education/insert", addEducation);
router.post("/education/update", editEducation);
router.get("/education/:alum_id", getEducation);

/* ===== PROFILE ===== */
router.post("/profile/insert", addProfile);
router.post("/profile/update", editProfile);
router.get("/profile/:alum_id", getProfileDetail);

/* ===== FULL PROFILE (JOIN API) ===== */
router.get("/full/:alum_id", getFullProfile);

router.post("/bioupdate", updateAluminiBio);


router.post("/posts/fullpostfetch", getAllAluminiPostDetail);
router.post("/posts/fullpostfetchmedia", getFullpostMediaDetail);


router.post('/events/getAllAluminiEvent',getAllAluminiEvents)
router.post('/events/getAllAluminiEventMedia',getAllAluminiEventsMedia)

module.exports = router;
