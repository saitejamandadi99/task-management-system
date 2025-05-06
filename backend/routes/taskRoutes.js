const express = require('express');
const router = express.Router();
const {createTask, updateTask, deleteTask, getTask, getAllTasks} = require('../controllers/taskControllers');
router.post('/create', createTask);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);
router.get('/getTask/:id', getTask);
router.get('/getAllTasks', getAllTasks);

module.exports = router;