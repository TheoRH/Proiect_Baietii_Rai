import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'author', // Rol implicit
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance.post('/user', formData);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 2000); // redirect
    } catch (err) {
      setError(err.response?.data?.message || 'A apărut o eroare la înregistrare.');
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
    success: {
      color: 'green',
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
    select: {
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Înregistrare Utilizator</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="username" style={styles.label}>Nume utilizator:</label>
        <input
          type="text"
          id="username"
          name="username"
          style={styles.input}
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password" style={styles.label}>Parolă:</label>
        <input
          type="password"
          id="password"
          name="password"
          style={styles.input}
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="role" style={styles.label}>Rol:</label>
        <select
          id="role"
          name="role"
          style={styles.select}
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="author">Autor</option>
          <option value="reviewer">Reviewer</option>
          <option value="organizer">Organizator</option>
        </select>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Înregistrează-te
        </button>
      </form>
    </div>
  );
}
