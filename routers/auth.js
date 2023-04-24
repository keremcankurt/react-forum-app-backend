const express = require('express');
const { register, confirmAccount, login, forgotPassword, changePassword, logout } = require('../controllers/auth');
const { checkUserExists, checkEmailExists } = require('../middlewares/database/databaseErrorHelpers');
const { getAccessToRoute } = require('../middlewares/authorization/auth');

const router = express.Router();
router.post("/register",register);
router.put("/confirmaccount",checkUserExists,confirmAccount);
router.post("/login",checkEmailExists,login);
router.get("/logout",getAccessToRoute,logout);
router.put("/forgotpassword",checkEmailExists,forgotPassword);
router.put("/forgotpassword/change",changePassword);

module.exports = router;