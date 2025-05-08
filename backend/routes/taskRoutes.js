const express = require('express');
const router = express.Router();
const {authorizationUser} = require('../middleware/authMiddleware');
const {createTask, updateTask, deleteTask, getTask, getAllTasks, getDashboardTasks, getTaskHistory} = require('../controllers/taskController');
router.post('/create',authorizationUser, createTask);
router.put('/update/:id',authorizationUser, updateTask);
router.delete('/delete/:id',authorizationUser, deleteTask);
router.get('/getTask/:id',authorizationUser, getTask);
router.get('/getAllTasks',authorizationUser, getAllTasks);
router.get('/dashboard', authorizationUser, getDashboardTasks);
router.get('/history', authorizationUser, getTaskHistory);

module.exports = router;