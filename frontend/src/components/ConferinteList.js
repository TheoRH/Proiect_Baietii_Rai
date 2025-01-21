import React from 'react';
import { useNavigate } from 'react-router-dom';
import conferenceStore from '../stores/conferenceStore';
import authStore from '../stores/AuthStore';
import { observer } from 'mobx-react';

function ConferinteList({ conferinte }) {
  const navigate = useNavigate(); // Hook pentru redirecționare
  const isOrganizer = authStore.getUser()?.role === 'organizer'; // Verifică rolul utilizatorului

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

          {/* Butonul de alaturare */}
          {authStore.getUser()?.role === 'author'&&(
            <button
              onClick={() => conferenceStore.deleteConference(conf.ConferenceId)}
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
              Alăturăte
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default observer(ConferinteList);
