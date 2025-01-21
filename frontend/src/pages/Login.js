import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import authStore from '../stores/AuthStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axiosInstance.post('/user/login', { username, password });
      authStore.login(response.data);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'A apărut o eroare la autentificare.';
      setError(errorMessage);
    }
  };
  

  return (
    <div>
      <h2>Autentificare</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Nume utilizator:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Parolă:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div>
        <p>
          Nu ai cont?{' '}
          <NavLink to="/register" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Creează cont
          </NavLink>
        </p>
      </div>
    </div>
  );
}



///////Marele comentariu:
//Trebuie sa fac cu conferintele sa isi ia update dupa login fara refresh, si la articole sa nu mai apara o secunda dupa disconnect.