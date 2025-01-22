import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import conferenceStore from '../stores/conferenceStore';
import authStore from '../stores/AuthStore';
import ConferinteList from '../components/ConferinteList';

const Conferinte = observer(() => {
  const [showForm, setShowForm] = useState(false); // Stare pentru vizibilitatea formularului
  const [newConference, setNewConference] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authStore.isLoggedIn()) {
      conferenceStore.fetchConferences();
    } else {
      conferenceStore.resetConferences();
    }
  }, [authStore.isLoggedIn()]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConference((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddConference = async () => {
    try {
      await conferenceStore.addConference(newConference);
      setNewConference({
        name: '',
        description: '',
        date: '',
        location: '',
        maxParticipants: '',
      });
      setError(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
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
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '10px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    formContainer: {
      marginTop: '10px',
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      height: '80px',
      marginBottom: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    },
    noConferences: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#666',
    },
  };

  if (!authStore.isLoggedIn()) {
    return (
      <div style={{ ...styles.container, color: 'red' }}>
        Trebuie să fii autentificat pentru a vedea conferințele.
      </div>
    );
  }

  if (conferenceStore.isLoading) {
    return <div style={styles.container}>Se încarcă conferințele...</div>;
  }

  if (conferenceStore.error) {
    return <div style={{ ...styles.container, ...styles.error }}>{conferenceStore.error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Conferințe Disponibile</h2>
      {authStore.getUser()?.role === 'organizer' && (
        <div>
          <button
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? 'Anulează' : 'Adaugă Conferință'}
          </button>
          {showForm && (
            <div style={styles.formContainer}>
              <h3>Adaugă o conferință</h3>
              <input
                type="text"
                name="name"
                placeholder="Nume"
                style={styles.input}
                value={newConference.name}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Descriere"
                style={styles.textarea}
                value={newConference.description}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="date"
                style={styles.input}
                value={newConference.date}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Locație"
                style={styles.input}
                value={newConference.location}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="maxParticipants"
                placeholder="Număr maxim de participanți"
                style={styles.input}
                value={newConference.maxParticipants}
                onChange={handleInputChange}
              />
              <button
                style={styles.button}
                onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                onClick={handleAddConference}
              >
                Adaugă
              </button>
              {error && <p style={styles.error}>{error}</p>}
            </div>
          )}
        </div>
      )}
      {conferenceStore.conferences.length === 0 ? (
        <p style={styles.noConferences}>Nu există conferințe disponibile.</p>
      ) : (
        <ConferinteList conferinte={conferenceStore.conferences} />
      )}
    </div>
  );
});

export default Conferinte;
