import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/DashboardTasks.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const DashboardTasks = () => {
    const router = useRouter();

    const [createdTasks, setCreatedTasks] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/tasks/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const {
                    createdTasks = [],
                    assignedTasks = [],
                    overdueTasks = [],
                    completedTasks = []
                } = res.data;

                setCreatedTasks(createdTasks);
                setAssignedTasks(assignedTasks);
                setOverdueTasks(overdueTasks);
                setCompletedTasks(completedTasks);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                router.push('/login'); // optional: logout on token failure
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className={`container-fluid ${styles.dashboardTasksContainer}`}>
            <h2 className="mb-4">Dashboard</h2>

            <div className="row">
                {/* Created Tasks */}
                <TaskCard title="Created Tasks" tasks={createdTasks} cardStyle={styles.taskCard} />

                {/* Assigned Tasks */}
                <TaskCard title="Assigned Tasks" tasks={assignedTasks} cardStyle={styles.taskCard} />

                {/* Overdue Tasks */}
                <TaskCard title="Overdue Tasks" tasks={overdueTasks} cardStyle={styles.overdueCard} />

                {/* Completed Tasks */}
                <TaskCard title="Completed Tasks" tasks={completedTasks} cardStyle={styles.completedCard} />
            </div>
        </div>
    );
};

// Extracted TaskCard component for reuse
const TaskCard = ({ title, tasks, cardStyle }) => (
    <div className="col-md-6 col-lg-3 mb-4">
        <div className={`card ${cardStyle}`}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{tasks.length}</p>
                {tasks.length > 0 && (
                    <ul className={styles.taskList}>
                        {tasks.slice(0, 5).map(task => (
                            <li key={task._id} className={styles.taskItem}>
                                {task.title.substring(0, 20)}...
                            </li>
                        ))}
                        {tasks.length > 5 && (
                            <li className={styles.taskItem}>+ {tasks.length - 5} more</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    </div>
);

export default DashboardTasks;
