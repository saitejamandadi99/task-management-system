// File: components/Navbar.jsx
import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from '../styles/Navbar.module.css';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>Task Manager</div>
      <button className={styles.menuButton} onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav className={`${styles.navLinks} ${isOpen ? styles.show : ''}`}>
        <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
        <Link href="/tasks" onClick={() => setIsOpen(false)}>All Tasks</Link>
        <Link href="/tasks/create" onClick={() => setIsOpen(false)}>Create Task</Link>
        <Link href="/history" onClick={() => setIsOpen(false)}>History</Link>
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default Navbar;
