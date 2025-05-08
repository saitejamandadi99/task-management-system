import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/CreateEditTask.module.css'; 
import Navbar from '../../components/Navbar'; // Assuming you have a Navbar component

const CreateTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [userList, setUserList] = useState([]);

  useEffect(() => {
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

    fetchUsers();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debugging line to check the token
      const response = await axios.post(
        'http://localhost:5000/api/tasks/create',
        {
          title,
          description,
          dueDate,
          priority,
          status,
          assignedTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 201) {
        const { message, task } = response.data;
        setSuccess(message);
        setError('');
        console.log('Task created:', task); // Debugging line to check the task data
      }
      

      // Optionally, redirect to the "All Tasks" page
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <h2 className={styles.title}>Create Task</h2>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="assignedTo">Assign To</label>
          <select
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Select User</option>
            {userList.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>


        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
      {error && <p className="alert alert-danger mt-2 text-center">{error}</p>}
      {success && <p className="alert alert-success mt-2 text-center">{success}</p>}
      <div className="text-center mt-3">
        <p className="text-center mt-3">Go back to <a href="/tasks">All Tasks</a></p>
      </div>
    </div>
    </>
  );
};

export default CreateTaskPage;