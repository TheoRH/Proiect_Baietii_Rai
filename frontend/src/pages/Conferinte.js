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
  


  if (!authStore.isLoggedIn()) {
    return <div style={{ color: 'red', padding: '20px' }}>Trebuie să fii autentificat pentru a vedea conferințele.</div>;
  }

  if (conferenceStore.isLoading) {
    return <div>Se încarcă conferințele...</div>;
  }

  if (conferenceStore.error) {
    return <div style={{ color: 'red' }}>{conferenceStore.error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Conferințe Disponibile</h2>
      {authStore.getUser()?.role === 'organizer' && (
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? 'Anulează' : 'Adaugă Conferință'}
          </button>
          {showForm && (
            <div style={{ marginTop: '10px' }}>
              <h3>Adaugă o conferință</h3>
              <input
                type="text"
                name="name"
                placeholder="Nume"
                value={newConference.name}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Descriere"
                value={newConference.description}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="date"
                value={newConference.date}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Locație"
                value={newConference.location}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="maxParticipants"
                placeholder="Număr maxim de participanți"
                value={newConference.maxParticipants}
                onChange={handleInputChange}
              />
              <button onClick={handleAddConference}>Adaugă</button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          )}
        </div>
      )}
      {conferenceStore.conferences.length === 0 ? (
        <p>Nu există conferințe disponibile.</p>
      ) : (
        <ConferinteList conferinte={conferenceStore.conferences} />
      )}
    </div>
  );
});

export default Conferinte;
