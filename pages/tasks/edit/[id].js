import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../../styles/EditTaskPage.module.css';

const EditTaskPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    status: 'Pending',
    assignedTo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userList, setUserList] = useState([]);

  
  const fetchTask = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/getTask/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { title, description, dueDate, priority, status, assignedTo } = res.data.task;
      setTaskData({
        title,
        description,
        dueDate: dueDate.split('T')[0],
        priority,
        status,
        assignedTo: assignedTo || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching task');
    }
  };


  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserList(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };


  useEffect(() => {
    if (id) {
      fetchTask();
      fetchUsers();
    }
  }, [id]);

  // ✅ Input change handler
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/tasks/update/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Task updated successfully!');
      router.push('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Edit Task</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Title</label>
        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <label className={styles.label}>Description</label>
        <textarea
          name="description"
          value={taskData.description}
          onChange={handleChange}
          className={styles.textarea}
        />

        <label className={styles.label}>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={taskData.dueDate}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <label className={styles.label}>Priority</label>
        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label className={styles.label}>Status</label>
        <select
          name="status"
          value={taskData.status}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <label className={styles.label}>Assign To</label>
        <select
          name="assignedTo"
          value={taskData.assignedTo}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select User</option>
          {userList.map((user) => (
            <option key={user._id} value={user._id}>
              {user.email}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Updating...' : 'Update Task'}
        </button>
      </form>
    </div>
  );
};

export default EditTaskPage;
