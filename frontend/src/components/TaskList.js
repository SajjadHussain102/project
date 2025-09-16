import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

    const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
        console.error('Delete failed:', err.response?.data?.msg || err.message);
        alert('Failed to delete task. Please try again.'); // Notify user
    }
    };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>My Tasks</h2>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/tasks/new">
        <button>Add Task</button>
      </Link>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
            <Link to={`/tasks/edit/${task._id}`}>
              <button>Edit</button>
            </Link>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;