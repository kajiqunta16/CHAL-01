const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');


// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Get user profile
router.get('/:userId', userController.getUserProfile);

// Update user profile
router.put('/:userId', userController.updateUserProfile);

// Delete user account
router.delete('/:userId', userController.deleteUserAccount);

// Change user password
router.put('/:userId/change-password', userController.changeUserPassword);
module.exports = router;
