import React from 'react';

function ConferinteList({ conferinte }) {
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
        </li>
      ))}
    </ul>
  );
}

export default ConferinteList;
