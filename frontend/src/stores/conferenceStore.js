import { makeAutoObservable, autorun } from 'mobx';
import axiosInstance from '../axiosConfig';
import authStore from './AuthStore';

class ConferenceStore {
  conferences = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);

    // Autorun pentru reload
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

    this.isLoading = true;
    this.error = null;
    try {
      const response = await axiosInstance.get('/conference', {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      this.conferences = response.data;
    } catch (error) {
      console.error('Eroare la obținerea conferințelor:', error.response?.data || error.message);
      this.error = error.response?.data?.message || 'Eroare la obținerea conferințelor.';
    } finally {
      this.isLoading = false;
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
  
      // Actualizăm lista fără a necesita refresh
      this.conferences = [...this.conferences, newConference];
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
  
      // Eliminăm conferința din listă
      this.conferences = this.conferences.filter(
        (conference) => conference.ConferenceId !== conferenceId
      );
    } catch (error) {
      console.error('Eroare la ștergerea conferinței:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Eroare la ștergerea conferinței.');
    }
  }
  

  resetConferences() {
    this.conferences = [];
    this.error = null;
  }
}

const conferenceStore = new ConferenceStore();
export default conferenceStore;
