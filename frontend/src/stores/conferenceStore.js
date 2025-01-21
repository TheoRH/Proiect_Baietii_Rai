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

  resetConferences() {
    this.conferences = [];
    this.error = null;
  }
}

const conferenceStore = new ConferenceStore();
export default conferenceStore;
