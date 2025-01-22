import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import conferenceStore from '../stores/conferenceStore';
import authStore from '../stores/AuthStore';
import axiosInstance from '../axiosConfig';
import { observer } from 'mobx-react';

function ConferinteList({ conferinte }) {
  const navigate = useNavigate(); // Hook pentru redirecționare
  const isOrganizer = authStore.getUser()?.role === 'organizer'; // Verifică rolul utilizatorului
  const [participation, setParticipation] = useState({}); // Stare pentru a stoca participarea utilizatorului

  // Verifică participarea utilizatorului pentru toate conferințele
  useEffect(() => {
    const checkParticipation = async () => {
      if (!authStore.getToken()) return;

      try {
        const promises = conferinte.map((conf) =>
          axiosInstance
            .get(`/conference/${conf.ConferenceId}/authors/participation`, {
              headers: { Authorization: `Bearer ${authStore.getToken()}` },
            })
            .then((res) => ({ id: conf.ConferenceId, isParticipating: res.data.isParticipating }))
        );

        const results = await Promise.all(promises);
        const participationMap = results.reduce((acc, item) => {
          acc[item.id] = item.isParticipating;
          return acc;
        }, {});

        setParticipation(participationMap);
      } catch (error) {
        console.error('Eroare la verificarea participării:', error);
      }
    };

    checkParticipation();
  }, [conferinte]);

  const handleJoinConference = async (conferenceId) => {
    try {
      await conferenceStore.joinConference(conferenceId);

      // Actualizează starea locală pentru această conferință
      setParticipation((prevState) => ({
        ...prevState,
        [conferenceId]: true, // Setează conferința ca fiind „participată”
      }));
    } catch (error) {
      console.error('Eroare la alăturarea conferinței:', error);
    }
  };

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {conferinte.map((conf) => (
        <li
          key={conf.ConferenceId}
          style={{
            marginBottom: '15px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <h4>{conf.name}</h4>
          <p>Data: {new Date(conf.date).toLocaleDateString()}</p>
          <p>Organizator: {conf.organizerName}</p>
          <p>Locație: {conf.location}</p>
          <p>Participanți Maximi: {conf.maxParticipants}</p>

          {/* Butonul de ștergere */}
          {isOrganizer && conf.OrganizerId === authStore.getUser()?.id && (
            <button
              onClick={() => conferenceStore.deleteConference(conf.ConferenceId)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '5px 10px',
                marginRight: '10px',
                cursor: 'pointer',
              }}
            >
              Șterge
            </button>
          )}

          {/* Butonul de detalii */}
          <button
            onClick={() => navigate(`/conferinte/${conf.ConferenceId}`)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '5px 10px',
              marginRight: '10px',
              cursor: 'pointer',
            }}
          >
            Detalii
          </button>

          {/* Butonul de alăturare */}
          {authStore.getUser()?.role === 'author' && (
            participation[conf.ConferenceId] ? (
              <span style={{ color: 'green', fontWeight: 'bold' }}>Participi la această conferință</span>
            ) : (
              <button
                onClick={() => handleJoinConference(conf.ConferenceId)}
                style={{
                  backgroundColor: '#4A9419',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '5px 10px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Alătură-te
              </button>
            )
          )}
        </li>
      ))}
    </ul>
  );
}

export default observer(ConferinteList);
