const express = require('express');
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const { getUser, resetPassword, deleteUser, editDetails, getContents, getProfile } = require("../controllers/user");
const { checkUserExists } = require('../middlewares/database/databaseErrorHelpers');
const router = express.Router();


router.get("/profile", getAccessToRoute,getUser);
router.put("/resetpassword", [getAccessToRoute], resetPassword);
router.delete("/delete",getAccessToRoute, deleteUser);
router.put("/edit", getAccessToRoute,editDetails);
router.get("/contents", getAccessToRoute, getContents);
router.get("/profile/:id",checkUserExists, getProfile);

module.exports = router;