import React from 'react';
import authStore from '../stores/AuthStore';

const Home = () => {
  const user = authStore.getUser();

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    subtitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#555',
    },
    paragraph: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#444',
      marginBottom: '20px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    authorButton: {
      backgroundColor: '#007bff',
    },
    reviewerButton: {
      backgroundColor: '#28a745',
    },
    organizerButton: {
      backgroundColor: '#ffc107',
    },
    guestContainer: {
      textAlign: 'center',
    },
  };

  // Dacă utilizatorul nu este autentificat
  if (!user) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Bine ai venit!</h1>
        <p style={styles.paragraph}>
          Te rugăm să te autentifici pentru a accesa funcționalitățile platformei.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Acasă</h1>
      <p style={styles.paragraph}>Bine ai venit, <strong>{user.username}</strong>!</p>

      {user.role === 'author' && (
        <div>
          <h2 style={styles.subtitle}>Secțiune pentru autori</h2>
          <p style={styles.paragraph}>
            Aici poți trimite articole și verifica starea acestora.
          </p>
          <button
            style={{ ...styles.button, ...styles.authorButton }}
            onClick={() => {
              window.location.href = '/articole';
            }}
          >
            Vezi articolele mele
          </button>
        </div>
      )}

      {user.role === 'reviewer' && (
        <div>
          <h2 style={styles.subtitle}>Secțiune pentru revieweri</h2>
          <p style={styles.paragraph}>
            Aici poți examina articole și oferi feedback.
          </p>
          <button
            style={{ ...styles.button, ...styles.reviewerButton }}
            onClick={() => {
              window.location.href = '/articole';
            }}
          >
            Revizuiește articole
          </button>
        </div>
      )}

      {user.role === 'organizer' && (
        <div>
          <h2 style={styles.subtitle}>Secțiune pentru organizatori</h2>
          <p style={styles.paragraph}>
            Aici poți crea conferințe și gestiona articolele asociate.
          </p>
          <button
            style={{ ...styles.button, ...styles.organizerButton }}
            onClick={() => {
              window.location.href = '/conferinte';
            }}
          >
            Administrează conferințe
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
