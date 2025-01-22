import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import conferenceStore from '../stores/conferenceStore';
import authStore from '../stores/AuthStore';
import axiosInstance from '../axiosConfig';
import { observer } from 'mobx-react';

function ConferinteList({ conferinte }) {
  const navigate = useNavigate();
  const isOrganizer = authStore.getUser()?.role === 'organizer';
  const [participation, setParticipation] = useState({});

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
      setParticipation((prevState) => ({
        ...prevState,
        [conferenceId]: true,
      }));
    } catch (error) {
      console.error('Eroare la alăturarea conferinței:', error);
    }
  };

  const styles = {
    list: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    item: {
      marginBottom: '15px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    detail: {
      margin: '5px 0',
      color: '#555',
    },
    button: {
      padding: '8px 12px',
      marginRight: '10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    buttonDetails: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    buttonDelete: {
      backgroundColor: 'red',
      color: 'white',
    },
    buttonJoin: {
      backgroundColor: '#4A9419',
      color: 'white',
    },
    participationText: {
      color: 'green',
      fontWeight: 'bold',
    },
  };

  return (
    <ul style={styles.list}>
      {conferinte.map((conf) => (
        <li key={conf.ConferenceId} style={styles.item}>
          <h4 style={styles.title}>{conf.name}</h4>
          <p style={styles.detail}>Data: {new Date(conf.date).toLocaleDateString()}</p>
          <p style={styles.detail}>Organizator: {conf.organizerName}</p>
          <p style={styles.detail}>Locație: {conf.location}</p>
          <p style={styles.detail}>Participanți Maximi: {conf.maxParticipants}</p>

          {/* Butonul de ștergere */}
          {isOrganizer && conf.OrganizerId === authStore.getUser()?.id && (
            <button
              onClick={() => conferenceStore.deleteConference(conf.ConferenceId)}
              style={{ ...styles.button, ...styles.buttonDelete }}
            >
              Șterge
            </button>
          )}

          {/* Butonul de detalii */}
          <button
            onClick={() => navigate(`/conferinte/${conf.ConferenceId}`)}
            style={{ ...styles.button, ...styles.buttonDetails }}
          >
            Detalii
          </button>

          {/* Butonul de alăturare */}
          {authStore.getUser()?.role === 'author' && (
            participation[conf.ConferenceId] ? (
              <span style={styles.participationText}>Participi la această conferință</span>
            ) : (
              <button
                onClick={() => handleJoinConference(conf.ConferenceId)}
                style={{ ...styles.button, ...styles.buttonJoin }}
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
