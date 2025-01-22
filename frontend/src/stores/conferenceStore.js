import { makeAutoObservable, autorun } from 'mobx';
import axiosInstance from '../axiosConfig';
import authStore from './AuthStore';

class ConferenceStore {
  conferences = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {
      fetchConferences: true,
      addConference: true,
      deleteConference: true,
      resetConferences: true,
    });

    // Autorun pentru gestionarea conferințelor la logare
    autorun(() => {
      if (authStore.isLoggedIn()) {
        this.fetchConferences();
      } else {
        this.resetConferences();
      }
    });
  }

  async fetchConferences() {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate încărca lista de conferințe.');
      return;
    }

    this.setLoading(true);
    this.setError(null);
    try {
      const response = await axiosInstance.get('/conference', {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      this.setConferences(response.data);
    } catch (error) {
      console.error('Eroare la obținerea conferințelor:', error.response?.data || error.message);
      this.setError(error.response?.data?.message || 'Eroare la obținerea conferințelor.');
    } finally {
      this.setLoading(false);
    }
  }

  async addConference(conferenceData) {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate adăuga conferința.');
      return;
    }

    try {
      const response = await axiosInstance.post('/conference', conferenceData, {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });

      const newConference = response.data;

      // Adaugă conferința în lista existentă
      this.setConferences([...this.conferences, newConference]);
    } catch (error) {
      console.error('Eroare la adăugarea conferinței:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Eroare la adăugarea conferinței.');
    }
  }

  async deleteConference(conferenceId) {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate șterge conferința.');
      return;
    }

    try {
      await axiosInstance.delete(`/conference/${conferenceId}`, {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });

      // Elimină conferința din listă
      this.setConferences(
        this.conferences.filter((conference) => conference.ConferenceId !== conferenceId)
      );
    } catch (error) {
      console.error('Eroare la ștergerea conferinței:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Eroare la ștergerea conferinței.');
    }
  }

  async joinConference(conferenceId) {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate alătura la conferință.');
      return;
    }
  
    try {
      const response = await axiosInstance.post(`/conference/${conferenceId}/authors`, {}, {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      console.log(response.data.message); // Mesaj de succes
      return response.data.message;
    } catch (error) {
      console.error('Eroare la alăturarea la conferință:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Eroare la alăturarea la conferință.');
    }
  }
  
  



  resetConferences() {
    this.conferences = [];
    this.error = null;
  }

  // Metode pentru modificarea stării observabile
  setLoading(loading) {
    this.isLoading = loading;
  }

  setError(error) {
    this.error = error;
  }

  setConferences(conferences) {
    this.conferences = conferences;
  }
}

const conferenceStore = new ConferenceStore();
export default conferenceStore;
