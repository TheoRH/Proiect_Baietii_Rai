import React from 'react';
import conferenceStore from '../stores/conferenceStore';
import authStore from '../stores/AuthStore';
import { observer } from 'mobx-react';

function ConferinteList({ conferinte }) {
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

          {/* Afișează butonul de ștergere doar dacă utilizatorul este organizator și conferința îi aparține */}
          {isOrganizer && conf.OrganizerId === authStore.getUser()?.id && (
            <button
              onClick={() => conferenceStore.deleteConference(conf.ConferenceId)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Șterge
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default observer(ConferinteList);
