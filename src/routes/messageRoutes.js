const express = require('express');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth.protect);

router.post('/', messageController.sendMessage);
router.post('/:id/toggle-like', messageController.toggleLikeMessage);
router.get('/:groupId', messageController.getGroupMessages);

module.exports = router;