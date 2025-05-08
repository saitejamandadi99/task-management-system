import styles from '../styles/NoTasks.module.css';

const NoTasks = ({ message = "No tasks found" }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>{message}</p>
    </div>
  );
};

export default NoTasks;
