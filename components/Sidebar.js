// File: components/Sidebar.jsx
import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className={styles.navbar}>
        <button onClick={toggleSidebar} className={styles.menuButton}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className={styles.logo}>Task Manager</h1>
      </div>
      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/logs">Logs</Link>
          </li>
          <li>
            <Link href="/tasks">All Tasks</Link>
          </li>
          <li>
            <Link href="/tasks/create">Create Task</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
