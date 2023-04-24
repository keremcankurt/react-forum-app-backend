const express = require('express');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const { checkAccountConfirmation, checkUserExists } = require('../middlewares/database/databaseErrorHelpers');
const { addContent, getAllContents, getContent, getUserContents } = require('../controllers/content');
const router = express.Router();

router.post('/add',[getAccessToRoute, checkAccountConfirmation], addContent);
router.get('/getallcontents', getAllContents);
router.get('/getcontent/:id', getContent);
router.get('/getusercontents/:id',checkUserExists, getUserContents);
module.exports = router;