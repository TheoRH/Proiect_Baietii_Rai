import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import authStore from '../stores/AuthStore';

const ConferenceDetails = () => {
  const { id } = useParams(); // Obține ID-ul conferinței din URL
  const [conference, setConference] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [allocatedReviewers, setAllocatedReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [message, setMessage] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');

  // Fetch detalii conferință, lista de revieweri și reviewerii alocați
  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await axiosInstance.get(`/conference/${id}`);
        setConference(response.data);
      } catch (error) {
        console.error('Eroare la obținerea detaliilor conferinței:', error);
      }
    };

    const fetchReviewers = async () => {
      try {
        const response = await axiosInstance.get('/reviewers', {
          headers: { Authorization: `Bearer ${authStore.getToken()}` },
        });
        setReviewers(response.data);
      } catch (error) {
        console.error('Eroare la obținerea reviewerilor:', error);
        setMessage('Nu s-au putut încărca reviewerii disponibili.');
      }
    };

    fetchConferenceDetails();
    fetchReviewers();
    updateAllocatedReviewers();
  }, [id]);

  //Functie pentru trimiterea unui articol
  const handleProposeArticle = async () => {
    if (!articleTitle || !articleContent) {
      setMessage('Completează toate câmpurile pentru a propune un articol.');
      return;
    }
  
    try {
      console.log('Titlu articol:', articleTitle);
      console.log('Conținut articol:', articleContent);
      const authorName = authStore.getUser()?.username; // Obține numele utilizatorului autentificat
      if (!authorName) {
        setMessage('Nu am putut determina numele autorului. Verifică autentificarea.');
        return;
      }
  
      await axiosInstance.post(
        `/conference/${id}/articles`,
        { title: articleTitle, content: articleContent, authorName }, // Trimite și authorName
        { headers: { Authorization: `Bearer ${authStore.getToken()}` } }
      );
      setMessage('Articol propus cu succes!');
      setArticleTitle('');
      setArticleContent('');
    } catch (error) {
      console.error('Eroare la propunerea articolului:', error.response?.data || error.message);
      setMessage('A apărut o eroare la propunerea articolului.');
    }
  };

  // Funcție centralizată de actualizare a reviewerilor alocați
  const updateAllocatedReviewers = async () => {
    try {
      const response = await axiosInstance.get(`/conference/${id}/reviewers`, {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      setAllocatedReviewers(response.data);
    } catch (error) {
      console.error('Eroare la actualizarea reviewerilor alocați:', error);
      setMessage('Nu s-au putut încărca reviewerii alocați.');
    }
  };

  // Funcție de alocare a unui reviewer
  const handleAllocateReviewer = async () => {
    if (!selectedReviewer) {
      setMessage('Te rog selectează un reviewer.');
      return;
    }

    try {
      await axiosInstance.post(
        `/conference/${id}/reviewers`,
        { reviewerId: selectedReviewer },
        { headers: { Authorization: `Bearer ${authStore.getToken()}` } }
      );
      setMessage('Reviewer alocat cu succes!');
      setSelectedReviewer('');
      updateAllocatedReviewers(); // Actualizează automat lista
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'A apărut o eroare la alocarea reviewerului.';
      setMessage(errorMessage);
    }
  };

  const handleRemoveReviewer = async (reviewerId) => {
    try {
      await axiosInstance.delete(`/conference/${id}/reviewers`, {
        data: { reviewerId },
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      setMessage('Reviewer eliminat cu succes!');
      updateAllocatedReviewers(); // Actualizează automat lista
    } catch (error) {
      console.error('Eroare la ștergerea reviewerului:', error);
      setMessage('Nu s-a putut șterge reviewerul.');
    }
  };

  if (!conference) {
    return <div>Se încarcă detaliile conferinței...</div>;
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Detalii Conferință</h2>
      <p><strong>Nume:</strong> {conference.name}</p>
      <p><strong>Descriere:</strong> {conference.description}</p>
      <p><strong>Data:</strong> {new Date(conference.date).toLocaleDateString()}</p>
      <p><strong>Locație:</strong> {conference.location}</p>
      <p><strong>Participanți Maximi:</strong> {conference.maxParticipants}</p>
      <p><strong>Organizator:</strong> {conference.organizerName}</p>
  
      <h3>Revieweri alocați:</h3>
      {allocatedReviewers.length > 0 ? (
        <ul>
          {allocatedReviewers.map((reviewer) => (
            <li key={reviewer.UserId} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {reviewer.username}
              <button
                onClick={() => handleRemoveReviewer(reviewer.UserId)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '5px',
                  cursor: 'pointer',
                }}
              >
                Șterge
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nu există revieweri alocați.</p>
      )}
  
      {authStore.getUser()?.role === 'organizer' && conference.OrganizerId === authStore.getUser()?.id && (
        <div style={{ marginTop: '20px' }}>
          <h3>Alocare Reviewer</h3>
          <select
            value={selectedReviewer}
            onChange={(e) => setSelectedReviewer(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          >
            <option value="">Selectează un reviewer</option>
            {reviewers.map((reviewer) => (
              <option key={reviewer.UserId} value={reviewer.UserId}>
                {reviewer.username}
              </option>
            ))}
          </select>
          <button onClick={handleAllocateReviewer}>Alocă</button>
          {message && (
            <p style={{ marginTop: '10px', color: message.includes('succes') ? 'green' : 'red' }}>
              {message}
            </p>
          )}
        </div>
      )}

      {authStore.getUser()?.role === 'author' && (
        <div style={{ marginTop: '20px' }}>
          <h3>Propune un articol</h3>
          <input
            type="text"
            placeholder="Titlu articol"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            style={{
              display: 'block',
              marginBottom: '10px',
              padding: '5px',
              width: '100%',
            }}
          />
          <textarea
            placeholder="Conținut articol"
            value={articleContent}
            onChange={(e) => setArticleContent(e.target.value)}
            style={{
              display: 'block',
              marginBottom: '10px',
              padding: '5px',
              width: '100%',
              height: '100px',
            }}
          />
          <button
            onClick={handleProposeArticle}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Propune Articol
          </button>
          {message && (
            <p style={{ marginTop: '10px', color: message.includes('succes') ? 'green' : 'red' }}>
              {message}
            </p>
          )}
        </div>
      )}


    </div>
    
  );
};

export default ConferenceDetails;
