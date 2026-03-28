const {
  loginUserDetail,
  RegisterUser,
  FacloginUserDetail,
  AluminiLogin,
} = require("./usercontroller.controller");

const router = require("express").Router();

router.post("/login", loginUserDetail);
router.post("/signin", RegisterUser);

router.post("/faclogin", FacloginUserDetail);

router.post("/alumlogin", AluminiLogin);

module.exports = router;
