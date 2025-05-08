// File: components/TaskCard.jsx
import styles from '../styles/TaskCard.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const TaskCard = ({ task, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // Call the delete handler passed as a prop
        await onDelete(task._id); // Delete task by calling onDelete from parent component
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{task.title}</h3>
      <p><strong>Due Date:</strong> {task.dueDate?.split('T')[0]}</p>

      <div className={styles.actions}>
        {/* Toggle task details */}
        <button onClick={() => setShowDetails(!showDetails)} className={styles.readMore}>
          {showDetails ? 'Hide Details' : 'Read More'}
        </button>

        {/* Edit task link */}
        <Link href={`/tasks/edit/${task._id}`}>
          <button className={styles.editBtn}>
            <FaEdit /> Edit
          </button>
        </Link>

        {/* Delete task button */}
        <button onClick={handleDelete} className={styles.deleteBtn}>
          <FaTrash /> Delete
        </button>
      </div>

      {/* Conditionally render task details */}
      {showDetails && (
        <div className={styles.details}>
          <p><strong>Description:</strong> {task.description || 'No description provided'}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Assigned To:</strong> {task.assignedTo}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;

