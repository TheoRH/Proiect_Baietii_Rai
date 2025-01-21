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

    const fetchAllocatedReviewers = async () => {
      try {
        const response = await axiosInstance.get(`/conference/${id}/reviewers`, {
          headers: { Authorization: `Bearer ${authStore.getToken()}` },
        });
        setAllocatedReviewers(response.data);
      } catch (error) {
        console.error('Eroare la obținerea reviewerilor alocați:', error);
        setMessage('Nu s-au putut încărca reviewerii alocați.');
      }
    };

    fetchConferenceDetails();
    fetchReviewers();
    fetchAllocatedReviewers();
  }, [id]);

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
      // Reîncarcă lista reviewerilor alocați
      const response = await axiosInstance.get(`/conference/${id}/reviewers`, {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      setAllocatedReviewers(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'A apărut o eroare la alocarea reviewerului.';
      setMessage(errorMessage);
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
      {conference.Reviewers?.length > 0 ? (
        <ul>
          {conference.Reviewers.map((reviewer) => (
            <li key={reviewer.UserId}>{reviewer.username}</li>
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
    </div>
  );
  
};

export default ConferenceDetails;
