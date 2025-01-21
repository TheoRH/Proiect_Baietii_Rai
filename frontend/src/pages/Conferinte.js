import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import conferenceStore from '../stores/conferenceStore';
import authStore from '../stores/AuthStore';
import ConferinteList from '../components/ConferinteList';

const Conferinte = observer(() => {
  useEffect(() => {
    if (authStore.isLoggedIn()) {
      conferenceStore.fetchConferences();
    } else {
      conferenceStore.conferences = []; // Reseteaza lista daca utilizatorul nu este autentificat
    }
  }, [authStore.isLoggedIn()]);

  if (!authStore.isLoggedIn()) {
    return <div style={{ color: 'red', padding: '20px' }}>Trebuie să fii autentificat pentru a vedea conferințele.</div>;
  }

  if (conferenceStore.isLoading) {
    return <div>Se încarcă conferințele...</div>;
  }

  if (conferenceStore.error) {
    return <div style={{ color: 'red' }}>{conferenceStore.error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Conferințe Disponibile</h2>
      {conferenceStore.conferences.length === 0 ? (
        <p>Nu există conferințe disponibile.</p>
      ) : (
        <ConferinteList conferinte={conferenceStore.conferences} />
      )}
    </div>
  );
});

export default Conferinte;
