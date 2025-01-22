import React from 'react';
import authStore from '../stores/AuthStore';

const Home = () => {
  const user = authStore.getUser();

  // Dacă utilizatorul nu este autentificat
  if (!user) {
    return (
      <div>
        <h1>Bine ai venit!</h1>
        <p>Te rugăm să te autentifici pentru a accesa funcționalitățile platformei.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Acasă</h1>
      <p>Bine ai venit, {user.username}!</p>

      {user.role === 'author' && (
        <div>
          <h2>Secțiune pentru autori</h2>
          <p>Aici poți trimite articole și verifica starea acestora.</p>
          {/* Adaugă un buton sau un link către pagina de trimitere a articolelor */}
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => {
              // Navighează către pagina articolelor
              window.location.href = '/articles';
            }}
          >
            Vezi articolele mele
          </button>
        </div>
      )}

      {user.role === 'reviewer' && (
        <div>
          <h2>Secțiune pentru revieweri</h2>
          <p>Aici poți examina articole și oferi feedback.</p>
          {/* Adaugă un buton sau un link către pagina de revizuire */}
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => {
              // Navighează către pagina articolelor de revizuit
              window.location.href = '/review';
            }}
          >
            Revizuiește articole
          </button>
        </div>
      )}

      {user.role === 'organizer' && (
        <div>
          <h2>Secțiune pentru organizatori</h2>
          <p>Aici poți crea conferințe și gestiona articolele asociate.</p>
          {/* Adaugă un buton sau un link către pagina de administrare */}
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => {
              // Navighează către pagina de administrare
              window.location.href = '/admin';
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
