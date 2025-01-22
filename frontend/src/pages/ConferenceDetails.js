import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import authStore from '../stores/AuthStore';
import ArticolCard from '../components/ArticolCard';

const ConferenceDetails = () => {
  const { id } = useParams(); // Obține ID-ul conferinței din URL
  const [conference, setConference] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [allocatedReviewers, setAllocatedReviewers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [message, setMessage] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [isParticipating, setIsParticipating] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch participare utilizator la conferință
  useEffect(() => {
    const checkParticipation = async () => {
      try {
        const response = await axiosInstance.get(`/conference/${id}/authors/participation`, {
          headers: { Authorization: `Bearer ${authStore.getToken()}` },
        });
        setIsParticipating(response.data.isParticipating);
      } catch (error) {
        console.error('Eroare la verificarea participării:', error);
      }
    };

    checkParticipation();
  }, [id]);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await axiosInstance.get(`/conference/${id}`);
        setConference(response.data);
      } catch (error) {
        console.error('Eroare la obținerea detaliilor conferinței:', error);
      }
    };
    const fetchArticles = async () => {
      try {
        const response = await axiosInstance.get(`/conference/${id}/articles`, {
          headers: { Authorization: `Bearer ${authStore.getToken()}` },
        });
        setArticles(response.data); // Setează articolele primite
        setLoading(false); // Opresc încărcarea
      } catch (error) {
        console.error('Eroare la obținerea articolelor conferinței:', error);
        setLoading(false);
      }
    };

    fetchConferenceDetails();
    fetchArticles();
  }, [id]);

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

  // Functie pentru trimiterea unui articol
  const handleProposeArticle = async () => {
    if (!articleTitle || !articleContent) {
      setMessage('Completează toate câmpurile pentru a propune un articol.');
      return;
    }

    try {
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
      updateAllocatedReviewers(); // Actualizează automat lista
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
        {
          headers: { Authorization: `Bearer ${authStore.getToken()}` }
        }
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

  const isOrganizer = authStore.getUser()?.role === 'organizer' &&
    conference?.OrganizerId === authStore.getUser()?.id;

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center',
    },
    section: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    detail: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#444',
    },
    subTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#555',
    },
    list: {
      padding: 0,
      listStyle: 'none',
    },
    listItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#fff',
    },
    input: {
      display: 'block',
      marginBottom: '10px',
      padding: '10px',
      width: '100%',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    textarea: {
      display: 'block',
      marginBottom: '10px',
      padding: '10px',
      width: '100%',
      height: '100px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    button: {
      padding: '8px 12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    buttonDelete: {
      backgroundColor: 'red',
      marginRight: '10px',
    },
    message: {
      marginTop: '10px',
      color: 'red',
    },
    messageSuccess: {
      marginTop: '10px',
      color: 'green',
    },
    
  };

  if (!conference) {
    return <div>Se încarcă detaliile conferinței...</div>;
  }

  return (

    

    <div style={styles.container}>
      <h2 style={styles.title}>Detalii Conferință</h2>
      <div style={styles.section}>
        <p style={styles.detail}><strong>Nume:</strong> {conference.name}</p>
        <p style={styles.detail}><strong>Descriere:</strong> {conference.description}</p>
        <p style={styles.detail}><strong>Data:</strong> {new Date(conference.date).toLocaleDateString()}</p>
        <p style={styles.detail}><strong>Locație:</strong> {conference.location}</p>
        <p style={styles.detail}><strong>Participanți Maximi:</strong> {conference.maxParticipants}</p>
        <p style={styles.detail}><strong>Organizator:</strong> {conference.organizerName}</p>
      </div>
      
      <div style={styles.section}>
  <h3 style={styles.subTitle}>Revieweri Alocați</h3>
  
  {isOrganizer && (
    <div style={{ marginBottom: '20px' }}>
      <select
        value={selectedReviewer}
        onChange={(e) => setSelectedReviewer(e.target.value)}
        style={styles.input}
      >
        <option value="">Selectează un reviewer</option>
        {reviewers.map((reviewer) => (
          <option key={reviewer.UserId} value={reviewer.UserId}>
            {reviewer.username}
          </option>
        ))}
      </select>
      <button
        onClick={handleAllocateReviewer}
        style={styles.button}
      >
        Alocă Reviewer
      </button>
    </div>
  )}

  {allocatedReviewers.length > 0 ? (
    <ul style={styles.list}>
      {allocatedReviewers.map((reviewer) => (
        <li key={reviewer.UserId} style={styles.listItem}>
          <span>{reviewer.username}</span> {/* Nume reviewer în stânga */}
          {isOrganizer && (
            <button
              onClick={() => handleRemoveReviewer(reviewer.UserId)}
              style={{ ...styles.button, ...styles.buttonDelete }}
            >
              Șterge
            </button>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p>Nu există revieweri alocați.</p>
  )}
</div>


      <div style={styles.section}>
        <h3 style={styles.subTitle}>Articole Asociate</h3>
        {loading ? (
          <p>Se încarcă articolele...</p>
        ) : articles.length === 0 ? (
          <p>Nu există articole asociate acestei conferințe.</p>
        ) : (
          <div style={styles.grid}>
            {articles.map((articol) => (
              <ArticolCard key={articol.ArticleId} articol={articol} />
            ))}
          </div>
        )}
      </div>

      {authStore.getUser()?.role === 'author' && (
        <div style={styles.section}>
          <h3 style={styles.subTitle}>Propune un Articol</h3>
          <input
            type="text"
            placeholder="Titlu articol"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Conținut articol"
            value={articleContent}
            onChange={(e) => setArticleContent(e.target.value)}
            style={styles.textarea}
          />
          <button
            onClick={handleProposeArticle}
            style={styles.button}
          >
            Propune Articol
          </button>
          {message && (
            <p
              style={message.includes('succes') ? styles.messageSuccess : styles.message}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>

    
  );
};

export default ConferenceDetails;