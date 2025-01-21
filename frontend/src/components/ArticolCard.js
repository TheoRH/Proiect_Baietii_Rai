import React from 'react';

function ArticolCard({ articol }) {
  const cardStyle = {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor:
      articol.status === 'acceptat'
        ? '#d4edda'
        : articol.status === 'respins'
        ? '#f8d7da'
        : '#fff3cd',
  };

  return (
    <div style={cardStyle}>
      <h3>{articol.title}</h3>
      <p>Autor: {articol.authorName}</p>
      <p>Status: {articol.status}</p>
      <p>Data trimiterii: {new Date(articol.submittedDate).toLocaleDateString()}</p>
    </div>
  );
}

export default ArticolCard;
