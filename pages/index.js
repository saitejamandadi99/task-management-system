import Link from 'next/link';
import styles from '../styles/Landing.module.css';

const Landing = () => {
  return (
    <main className={styles.wrapper}>
      <div className={styles.overlay}>
        <section className={styles.content}>
          <h1 className={styles.title}>TaskMaster Pro</h1>
          <p className={styles.subtitle}>
            Organize, assign, and track your team’s work from one place.
          </p>
          <div className={styles.buttons}>
            <Link href="/register" className={styles.btn + ' ' + styles.primary}>Get Started</Link>
            <Link href="/login" className={styles.btn + ' ' + styles.secondary}>Login</Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Landing;
