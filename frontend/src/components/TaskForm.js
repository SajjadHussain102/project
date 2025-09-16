import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // For editing

    useEffect(() => {
    if (id) {
        axios.get(`http://localhost:5000/api/tasks/${id}`).then((res) => {
        const task = res.data;
        setTitle(task.title || '');
        setDescription(task.description || '');
        setCompleted(task.completed || false);
        }).catch((err) => {
        console.error('Fetch task error:', err.response?.data?.msg || err.message);
        alert('Failed to load task. Redirecting to tasks list.');
        navigate('/tasks'); // Redirect if fetch fails
        });
    }
    }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update task
        await axios.put(`http://localhost:5000/api/tasks/${id}`, { title, description, completed });
      } else {
        // Create task
        await axios.post('http://localhost:5000/api/tasks', { title, description });
      }
      navigate('/tasks');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Task' : 'New Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {id && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
              Completed
            </label>
          </div>
        )}
        <button type="submit">{id ? 'Update' : 'Create'}</button>
        <button type="button" onClick={() => navigate('/tasks')}>Cancel</button>
      </form>
    </div>
  );
};

export default TaskForm;