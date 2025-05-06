const Task = require('../models/Task')
//create task 
const createTask = async(req, res)=>{
    try{
    const {title, description, dueDate, priority, status, createdBy, assignedTo} = req.body
    if (!title || !dueDate){
        return res.status(400).json({message: 'Please add title, dueDate.'})
    }
    const task = await Task.create({
        title,
        description,
        dueDate,
        priority,
        status,
        createdBy:req.user._id,
        assignedTo: assignedTo || req.user._id,
    });
    res.status(201).json({message:'Task created successfully', task: task}) 
}
    catch(error){
        res.status(500).json({message: error.message})
    }
}

//update task
const updateTask = async (req, res)=>{
    try{
        const {title, description , dueDate, priority, status, assignedTo}  = req.body
        const task = await Task.findById(req.params.id)
        if (!task){
            return res.status(404).json({message:'Task not found'})
        }
        if(task.createdBy.toString() !== req.user._id.toString()){
            return res.status(401).json({message: 'Not authorized to update this task'})
        }
        const updateFields = {
            title: title || task.title,
            description: description || task.description, 
            dueDate: dueDate || task.dueDate, 
            priority: priority || task.priority, 
            status: status || task.status, 
            assignedTo: assignedTo || task.assignedTo || req.user._id
        }
        const updateTask = await Task.findByIdAndUpdate(req.params.id, updateFields, {new: true})
        if (!updateTask){
            return res.status(404).json({message: 'Task not found'})
        }
        return res.status(200).json({message:'Task updated successfully', task: updateTask})
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}

//delete task 
const deleteTask = async (req, res) =>{
    try {
        const task = await Task.findById(req.params.id);
        if (!task){
            return res.status(404).json({message:'Task not found'})
        }
        if (task.createdBy.toString() !== req.user._id.toString()){
            return res.status(401).json({message:'Not authorized to delete this task. '})
        }
        await Task.findByIdAndDelete(req.params.id);
        
        return res.status(200).json({message:'Task deleted successfully'})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

//get task by id
const getTask = async (req, res) =>{
    try {
        const task = await Task.findById(req.params.id)
        const userId = req.user._id.toString()
        if (!task){
            return res.status(404).json({message:'Task not found'})
        }
        if (task.createdBy.toString() !== userId && task.assignedTo?.toString() !== userId){
            return res.status(401).json({message: 'Not authorized to view this task'})
        }
        return res.status(200).json({task})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}

// get all tasks 
const getAllTasks = async (req, res) =>{
    try {
        const userId = req.user._id 
        const tasks = await Task.find({$or:[{createdBy:userId}, {assignedTo:userId}]})
        if (tasks.length === 0){
            return res.status(404).json({message: 'No tasks found', tasks:[]})
        }
        return res.status(200).json({tasks})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    getAllTasks
}