const { loginUserDetail, RegisterUser, FacloginUserDetail } = require('./usercontroller.controller');

const router = require('express').Router();

router.post('/login',loginUserDetail);
router.post('/signin',RegisterUser)

router.post('/faclogin',FacloginUserDetail);
module.exports = router;