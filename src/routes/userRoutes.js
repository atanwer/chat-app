const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth.protect, auth.restrictTo('admin'), userController.createUser);
router.patch('/:id', auth.protect, auth.restrictTo('admin'), userController.editUser);
router.get('/', auth.protect, userController.getAllUsers);

module.exports = router;