import React, { useState } from 'react';
import articleStore from '../stores/articleStore';
import authStore from '../stores/AuthStore';

function ArticolCard({ articol }) {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const isAuthor = authStore.getUser()?.role === 'author';
  const isReviewer = authStore.getUser()?.role === 'reviewer';

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      setError('Feedback-ul nu poate fi gol.');
      return;
    }

    try {
      await articleStore.sendFeedback(articol.ArticleId, feedback);
      setFeedback('');
    } catch (err) {
      setError('A apărut o eroare la trimiterea feedback-ului.');
    }
  };

  const handleSubmitNewVersion = async () => {
    try {
      const newContent = prompt('Introduceți conținutul noii versiuni:');
      if (newContent) {
        await articleStore.submitNewVersion(articol.ArticleId, newContent);
      }
    } catch (err) {
      setError('A apărut o eroare la actualizarea articolului.');
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor:
          articol.status === 'acceptat'
            ? '#d4edda'
            : articol.status === 'respins'
            ? '#f8d7da'
            : '#fff3cd',
      }}
    >
      <h3>{articol.title}</h3>
      <p>Autor: {articol.authorName}</p>
      <p>Status: {articol.status}</p>
      <p>Data trimiterii: {new Date(articol.submittedDate).toLocaleDateString()}</p>
      {articol.feedback && <p>Feedback: {articol.feedback}</p>}

      {isAuthor && articol.feedback && (
        <button onClick={handleSubmitNewVersion} style={{ marginTop: '10px' }}>
          Trimite o versiune nouă
        </button>
      )}

      {isReviewer && (
        <>
          <textarea
            placeholder="Introdu feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ width: '100%', height: '80px', marginTop: '10px' }}
          />
          <button onClick={handleSendFeedback} style={{ marginTop: '10px' }}>
            Trimite Feedback
          </button>
          <button
            onClick={() => articleStore.updateArticleStatus(articol.ArticleId, 'acceptat')}
            style={{ marginTop: '10px', marginRight: '10px', backgroundColor: 'green', color: 'white' }}
          >
            Aprobă
          </button>
          <button
            onClick={() => articleStore.updateArticleStatus(articol.ArticleId, 'respins')}
            style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}
          >
            Respinge
          </button>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ArticolCard;
