// File: pages/tasks/index.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from '../../components/TaskCard';
import Sidebar from '../../components/Navbar';
import styles from '../../styles/AllTasksPage.module.css';

const AllTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    dueDate: '',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      // Convert filters object to query string
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(
        `http://localhost:5000/api/tasks/getAllTasks?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data.tasks);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove task from state
    } catch (err) {
      console.error(err);
      setError('Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <h1 className={styles.title}>All Tasks</h1>

        <div className={styles.filters}>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by title or description..."
            className={styles.search}
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={filters.dueDate}
            onChange={handleChange}
            className={styles.datePicker}
          />
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.taskList}>
            {tasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task._id} task={task} onDelete={handleDelete} />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AllTasksPage;
