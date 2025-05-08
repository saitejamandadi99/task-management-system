// components/TaskForm.js
import styles from '../styles/TaskForm.module.css';

const TaskForm = ({ type = 'create', taskData = {}, onSubmit }) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2>{type === 'edit' ? 'Edit Task' : 'Create Task'}</h2>

      <label>Title</label>
      <input type="text" name="title" defaultValue={taskData.title || ''} required />

      <label>Description</label>
      <textarea name="description" defaultValue={taskData.description || ''} />

      <label>Due Date</label>
      <input type="date" name="dueDate" defaultValue={taskData.dueDate?.split('T')[0] || ''} required />

      <label>Priority</label>
      <select name="priority" defaultValue={taskData.priority || 'Low'}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <label>Status</label>
      <select name="status" defaultValue={taskData.status || 'Pending'}>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      <label>Assign To (User ID)</label>
      <input type="text" name="assignedTo" defaultValue={taskData.assignedTo || ''} />

      <button type="submit">{type === 'edit' ? 'Update Task' : 'Create Task'}</button>
    </form>
  );
};

export default TaskForm;
