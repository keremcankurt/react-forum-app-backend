const express = require('express');
const auth = require('./auth');
const user = require('./user');
const content = require('./content');
const comment = require('./comment');

const router = express.Router();
router.use("/auth",auth);
router.use("/user",user);
router.use("/content",content);
router.use("/comment", comment);

module.exports = router;