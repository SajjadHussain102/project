import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  // Check if token exists on page load
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      setUser({ email });
    } catch (err) {
      console.error(err.response?.data?.msg || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setToken(res.data.token);
      setUser({ email });
    } catch (err) {
      console.error(err.response?.data?.msg || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };