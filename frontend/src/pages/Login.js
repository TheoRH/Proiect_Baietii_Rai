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

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      fontSize: '24px',
      color: '#333',
      marginBottom: '20px',
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '10px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      marginBottom: '5px',
      fontSize: '14px',
      color: '#555',
    },
    input: {
      padding: '10px',
      marginBottom: '15px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: '100%',
    },
    button: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      textAlign: 'center',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    registerLink: {
      textAlign: 'center',
      marginTop: '15px',
    },
    navlink: {
      color: '#007bff',
      textDecoration: 'none',
    },
    navlinkHover: {
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Autentificare</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="username" style={styles.label}>Nume utilizator:</label>
        <input
          type="text"
          id="username"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password" style={styles.label}>Parolă:</label>
        <input
          type="password"
          id="password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Login
        </button>
      </form>
      <div style={styles.registerLink}>
        <p>
          Nu ai cont?{' '}
          <NavLink
            to="/register"
            style={styles.navlink}
            onMouseOver={(e) => (e.target.style.textDecoration = styles.navlinkHover.textDecoration)}
            onMouseOut={(e) => (e.target.style.textDecoration = styles.navlink.textDecoration)}
          >
            Creează cont
          </NavLink>
        </p>
      </div>
    </div>
  );
}
