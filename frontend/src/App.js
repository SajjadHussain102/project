import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <h1>Task Manager</h1>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={<PrivateRoute component={TaskList} />} />
            <Route path="/tasks/new" element={<PrivateRoute component={TaskForm} />} />
            <Route path="/tasks/edit/:id" element={<PrivateRoute component={TaskForm} />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Protect routes that require authentication
const PrivateRoute = ({ component: Component }) => {
  const { token } = useContext(AuthContext);
  return token ? <Component /> : <Navigate to="/login" />;
};

export default App;