import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Assuming you have a Navbar component
import styles from '../styles/History.module.css';
import { useRouter } from 'next/router';

const TaskHistory = () => {
  const router = useRouter();
  const [createdTasks, setCreatedTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/tasks/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCreatedTasks(res.data.createdTasks);
        setAssignedTasks(res.data.assignedTasks);
      } catch (error) {
        console.error('Failed to fetch task history:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  if (loading) return <div className="text-center mt-5">Loading history...</div>;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Task History</h2>

        {/* Created Tasks Section */}
        <section className={styles.section}>
          <h3>Created Tasks</h3>
          <div className={styles.taskList}>
            {createdTasks.map((task) => (
              <div key={task._id} className={styles.taskRow}>
                <p><strong>Title:</strong> {task.title}</p>
                <p><strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Assigned Tasks Section */}
        <section className={styles.section}>
          <h3>Tasks Assigned to You</h3>
          <div className={styles.taskList}>
            {assignedTasks.map((task) => (
              <div key={task._id} className={styles.taskRow}>
                <p><strong>Title:</strong> {task.title}</p>
                <p><strong>Created By:</strong> {task.createdBy?.name || 'Unknown'}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default TaskHistory;