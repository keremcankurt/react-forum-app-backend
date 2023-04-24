const express = require('express');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const { checkAccountConfirmation, checkContentExists } = require('../middlewares/database/databaseErrorHelpers');
const { addComment, getComments } = require('../controllers/comment');

const router = express.Router();

router.post('/:contentid', [getAccessToRoute, checkAccountConfirmation, checkContentExists], addComment);
router.get('/:contentid', checkContentExists, getComments);

module.exports = router;