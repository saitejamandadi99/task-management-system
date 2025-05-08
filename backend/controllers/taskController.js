const Task = require('../models/Task')
//create task 
const createTask = async (req, res)=>{
    try{
    const {title, description, dueDate, priority, status, assignedTo} = req.body
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
// File: controllers/taskController.js

const getAllTasks = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const { search, status, priority, dueDate } = req.query;
  
      // Base query: only show tasks created by or assigned to current user
      const query = {
        $or: [
          { createdBy: userId },
          { assignedTo: userId }
        ]
      };
  
      // Apply search filter (title or description)
      if (search) {
        query.$and = [
          {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } }
            ]
          }
        ];
      }
  
      // Apply status filter
      if (status) {
        query.status = status;
      }
  
      // Apply priority filter
      if (priority) {
        query.priority = priority;
      }
  
      // Apply dueDate filter (match on the selected day)
      if (dueDate) {
        const start = new Date(dueDate);
        const end = new Date(dueDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        query.dueDate = { $gte: start, $lte: end };
      }
  
      const tasks = await Task.find(query).sort({ createdAt: -1 });
  
      res.status(200).json({ tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  

//dashboard tasks and contoller
const getDashboardTasks = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetching tasks based on different categories
        const createdTasks = await Task.find({ createdBy: userId });
        const assignedTasks = await Task.find({ assignedTo: userId });
        const date = new Date();
        const overdueTasks = await Task.find({ dueDate: { $lt: date }, status: 'Pending', assignedTo: userId });
        const completedTasks = await Task.find({ status: 'Completed', assignedTo: userId });

        // Return data for dashboard
        return res.status(200).json({
            createdTasks,
            assignedTasks,
            overdueTasks,
            completedTasks,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getTaskHistory = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const createdTasks = await Task.find({ createdBy: userId }).populate('assignedTo', 'name');
      const assignedTasks = await Task.find({ assignedTo: userId }).populate('createdBy', 'name');
  
      res.status(200).json({
        createdTasks,
        assignedTasks,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch task history', error: error.message });
    }
  };
  



module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    getAllTasks,
    getDashboardTasks,
    getTaskHistory,
}