import React, { useState } from 'react';
import articleStore from '../stores/articleStore';
import authStore from '../stores/AuthStore';

function ArticolCard({ articol, onRemove }) {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isFading, setIsFading] = useState(false);

  const isAuthor = authStore.getUser()?.role === 'author';
  const isReviewer = authStore.getUser()?.role === 'reviewer';

  // Funcție pentru determinarea stilurilor în funcție de status
  const getStatusStyle = () => {
    switch (articol.status.toLowerCase()) {
      case 'accepted':
        return { bg: '#d4edda', text: '#155724' };
      case 'rejected':
        return { bg: '#f8d7da', text: '#721c24' };
      case 'pending':
        return { bg: '#fff3cd', text: '#856404' };
      default:
        return { bg: '#ffffff', text: '#000000' };
    }
  };

  const statusStyle = getStatusStyle();

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      setError('Feedback-ul nu poate fi gol.');
      return;
    }

    try {
      await articleStore.sendFeedback(articol.ArticleId, feedback);
      setFeedback('');
      setError('');
    } catch (err) {
      setError('A apărut o eroare la trimiterea feedback-ului.');
    }
  };

  const handleSubmitNewVersion = async () => {
    try {
      const newContent = prompt('Introduceți conținutul noii versiuni:');
      if (newContent) {
        await articleStore.submitNewVersion(articol.ArticleId, newContent);
        setError('');
      }
    } catch (err) {
      setError('A apărut o eroare la actualizarea articolului.');
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await articleStore.updateArticleStatus(articol.ArticleId, status);
      setIsFading(true);
      setTimeout(() => {
        if (onRemove) {
          onRemove(articol.ArticleId); // Elimină articolul din listă
        }
      }, 300); // Durata efectului CSS
    } catch (err) {
      setError('A apărut o eroare la actualizarea statusului.');
    }
  };
  

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: statusStyle.bg,
        transition: 'opacity 0.3s ease',
        opacity: isFading ? 0 : 1, // Efect de dispariție
      }}
    >
      <h3>{articol.title}</h3>
      <p>Autor: {articol.authorName}</p>
      <p
        style={{
          color: statusStyle.text,
          fontWeight: 'bold',
          padding: '5px',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        Status: {articol.status}
      </p>
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
            onClick={() => handleStatusChange('accepted')}
            style={{ marginTop: '10px', marginRight: '10px', backgroundColor: 'green', color: 'white' }}
          >
            Aprobă
          </button>
          <button
            onClick={() => handleStatusChange('rejected')}
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
