// File: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const {authorizationUser} = require('../middleware/authMiddleware');

router.get('/all', authorizationUser, getAllUsers);

module.exports = router;
