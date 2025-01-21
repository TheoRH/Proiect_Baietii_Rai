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
      const response = await axiosInstance.post('/api/user', formData);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 2000); // redirect
    } catch (err) {
      setError(err.response?.data?.message || 'A apărut o eroare la înregistrare.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Înregistrare Utilizator</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Nume utilizator:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Parolă:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="role">Rol:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="author">Autor</option>
          <option value="reviewer">Reviewer</option>
          <option value="organizer">Organizator</option>
        </select>
        <button type="submit">Înregistrează-te</button>
      </form>
    </div>
  );
}
