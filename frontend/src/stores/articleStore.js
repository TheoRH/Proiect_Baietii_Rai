import { makeAutoObservable, autorun } from 'mobx';
import axiosInstance from '../axiosConfig';
import authStore from './AuthStore';

class ArticleStore {
  articles = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);

    // Autorun pentru gestionarea articolelor
    autorun(() => {
      if (authStore.isLoggedIn()) {
        this.fetchArticles();
      } else {
        this.resetArticles();
      }
    });
  }

  async fetchArticles() {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate încărca lista de articole.');
      return;
    }

    this.isLoading = true;
    this.error = null;
    try {
      const response = await axiosInstance.get('/article', {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      this.articles = response.data;
    } catch (error) {
      console.error('Eroare la obținerea articolelor:', error.response?.data || error.message);
      this.error = error.response?.data?.message || 'Eroare la obținerea articolelor.';
    } finally {
      this.isLoading = false;
    }
  }

  resetArticles() {
    this.articles = [];
    this.error = null;
  }
}

const articleStore = new ArticleStore();
export default articleStore;
