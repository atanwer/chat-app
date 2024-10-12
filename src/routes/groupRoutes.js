const express = require('express');
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth.protect);

router.post('/', groupController.createGroup);
router.get('/search', groupController.searchGroups);
router.delete('/:id', groupController.deleteGroup);
router.get('/:groupId', groupController.getGroupDetails);
router.post('/add-member', groupController.addMember);

module.exports = router;