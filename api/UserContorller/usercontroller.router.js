const {
  loginUserDetail,
  RegisterUser,
  FacloginUserDetail,
  AluminiLogin,
  saveContact,
} = require("./usercontroller.controller");

const router = require("express").Router();

router.post("/login", loginUserDetail);
router.post("/signin", RegisterUser);

router.post("/faclogin", FacloginUserDetail);

router.post("/alumlogin", AluminiLogin);

router.post("/contact", saveContact);

module.exports = router;
