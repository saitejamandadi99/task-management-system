const express = require('express');
const router = express.Router();
const {authorizedUser} = require('../middleware/authMiddleware');
const {createTask, updateTask, deleteTask, getTask, getAllTasks} = require('../controllers/taskControllers');
router.post('/create',authorizedUser, createTask);
router.put('/update/:id',authorizedUser, updateTask);
router.delete('/delete/:id',authorizedUser, deleteTask);
router.get('/getTask/:id',authorizedUser, getTask);
router.get('/getAllTasks',authorizedUser, getAllTasks);

module.exports = router;