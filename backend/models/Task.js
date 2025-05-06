const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        require:[true, 'Please add a title'],
    },
    description:{
        type:String,
    },
    dueDate:{
        type:Date,
        require:true,
    },
    priority:{
        type:String,
        enum:['Low', 'Medium', 'High'],
        default:'Low'
    },
    status:{
        type:String,
        enum:['Pending', 'Completed'],
        default:'Pending',
    }, 
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:'true',
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }

}
,
{
    timestamps:true,
});

module.exports = mongoose.model('Task', taskSchema);