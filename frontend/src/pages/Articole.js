import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import articleStore from '../stores/articleStore';
import authStore from '../stores/AuthStore';
import ArticolCard from '../components/ArticolCard';

const Articole = observer(() => {
  useEffect(() => {
    if (authStore.isLoggedIn()) {
      articleStore.fetchUserArticles(); // Preia articolele filtrate pentru utilizatorul curent
    }
  }, [authStore.isLoggedIn()]);

  if (!authStore.isLoggedIn()) {
    return <div style={{ color: 'red', padding: '20px' }}>Trebuie să fii autentificat pentru a vedea articolele.</div>;
  }

  if (articleStore.isLoading) {
    return <div>Se încarcă articolele...</div>;
  }

  if (articleStore.error) {
    return <div style={{ color: 'red' }}>{articleStore.error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Articole</h2>
      {articleStore.articles.length === 0 ? (
        <p>Nu există articole disponibile.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {articleStore.articles.map((articol) => (
            <ArticolCard key={articol.ArticleId} articol={articol} />
          ))}
        </div>
      )}
    </div>
  );
});

export default Articole;
