import React, { useState, useEffect } from 'react';
import articleStore from '../stores/articleStore';
import authStore from '../stores/AuthStore';
import axiosInstance from '../axiosConfig';

function ArticolCard({ articol, onRemove, showActions = true, onUpdate }) {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isFading, setIsFading] = useState(false);
  const [conferenceName, setConferenceName] = useState('');
  const [articolState, setArticol] = useState(articol);
  const [newVersion, setNewVersion] = useState('');
  const [showNewVersionField, setShowNewVersionField] = useState(false);

  const isAuthor = authStore.getUser()?.role === 'author';
  const isReviewer = authStore.getUser()?.role === 'reviewer';

  const fetchConferenceName = async (articleId) => {
    try {
      const response = await axiosInstance.get(`/article/${articleId}/conference-name`);
      setConferenceName(response.data);
    } catch (error) {
      console.error('Eroare la obținerea numelui conferinței:', error);
      setConferenceName('Nespecificată');
    }
  };

  useEffect(() => {
    fetchConferenceName(articolState.ArticleId);
  }, [articolState.ArticleId]);

  const getStatusStyle = () => {
    switch (articolState.status.toLowerCase()) {
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
      await articleStore.sendFeedback(articolState.ArticleId, feedback);
      setArticol((prev) => ({
        ...prev,
        feedback: feedback.trim(),
      }));
      setFeedback('');
      alert('Feedback trimis cu succes!');
    } catch (err) {
      setError('A apărut o eroare la trimiterea feedback-ului.');
    }
  };

  const handleSubmitNewVersion = async () => {
    if (!newVersion.trim()) {
      setError('Conținutul noii versiuni nu poate fi gol.');
      return;
    }

    try {
      await articleStore.submitNewVersion(articolState.ArticleId, newVersion);
      setArticol((prev) => ({
        ...prev,
        content: newVersion,
        feedback: '', // Golește feedback-ul după trimitere
      }));
      setNewVersion('');
      setShowNewVersionField(false);
      setError('');
    } catch (err) {
      setError('A apărut o eroare la trimiterea noii versiuni.');
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await articleStore.updateArticleStatus(articolState.ArticleId, status);
      setIsFading(true);
      setTimeout(() => {
        if (onRemove) {
          onRemove(articolState.ArticleId);
        }
      }, 300);
    } catch (err) {
      setError('A apărut o eroare la actualizarea statusului.');
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '15px',
        backgroundColor: statusStyle.bg,
        transition: 'opacity 0.3s ease',
        opacity: isFading ? 0 : 1,
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '1.5em' }}>{articolState.title}</h3>
      <p style={{ fontStyle: 'italic', marginBottom: '10px', color: '#7f8c8d' }}>Autor: {articolState.authorName}</p>
      <p
        style={{
          color: statusStyle.text,
          fontWeight: 'bold',
          padding: '5px 15px',
          borderRadius: '4px',
          display: 'inline-block',
          backgroundColor: '#f0f3f4',
          fontSize: '1em',
        }}
      >
        Status: {articolState.status}
      </p>
      <p style={{ color: '#34495e', marginTop: '10px', fontSize: '0.9em' }}>
        Data trimiterii: {new Date(articolState.submittedDate).toLocaleDateString()}
      </p>

      <p style={{ color: '#7f8c8d', marginTop: '10px', fontSize: '0.9em' }}>
        Conferință: <strong>{conferenceName || 'Nespecificată'}</strong>
      </p>

      <div
        style={{
          backgroundColor: '#ecf0f1',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '15px',
        }}
      >
        <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>Conținutul articolului:</h4>
        <p style={{ whiteSpace: 'pre-wrap', color: '#2c3e50', lineHeight: '1.6' }}>{articolState.content}</p>
      </div>

      {showActions && articolState.feedback && (
        <div
          style={{
            backgroundColor: '#fdfefe',
            padding: '15px',
            borderRadius: '10px',
            marginTop: '15px',
            border: '1px solid #dcdde1',
          }}
        >
          <strong style={{ color: '#34495e', display: 'block', marginBottom: '5px' }}>Feedback:</strong>
          <p style={{ color: '#2c3e50', lineHeight: '1.6' }}>{articolState.feedback}</p>
        </div>
      )}

      {isAuthor && (
        <>
          <button
            onClick={() => setShowNewVersionField(true)}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#2980b9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
            }}
          >
            Trimite o versiune nouă
          </button>
          {showNewVersionField && (
            <div style={{ marginTop: '15px' }}>
              <textarea
                placeholder="Introduceți conținutul noii versiuni"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '0.9em',
                }}
              />
              <button
                onClick={handleSubmitNewVersion}
                style={{
                  marginTop: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1em',
                }}
              >
                Trimite
              </button>
            </div>
          )}
        </>
      )}

      {showActions && isReviewer && (
        <>
          <textarea
            placeholder="Introdu feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              marginTop: '15px',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '0.9em',
            }}
          />
          <button
            onClick={handleSendFeedback}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
              marginRight: '10px',
            }}
          >
            Trimite Feedback
          </button>
          <button
            onClick={() => handleStatusChange('accepted')}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
              marginRight: '10px',
            }}
          >
            Aprobă
          </button>
          <button
            onClick={() => handleStatusChange('rejected')}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
            }}
          >
            Respinge
          </button>
        </>
      )}

      {error && <p style={{ color: 'red', marginTop: '15px', fontSize: '0.9em' }}>{error}</p>}
    </div>
  );
}

export default ArticolCard;
