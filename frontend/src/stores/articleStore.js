import { makeAutoObservable, autorun } from 'mobx';
import axiosInstance from '../axiosConfig';
import authStore from './AuthStore';

class ArticleStore {
  articles = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {
      fetchArticles: true,
      resetArticles: true,
    });

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

    this.setLoading(true);
    this.setError(null);

    try {
      const response = await axiosInstance.get('/article', {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      this.setArticles(response.data);
    } catch (error) {
      console.error('Eroare la obținerea articolelor:', error.response?.data || error.message);
      this.setError(error.response?.data?.message || 'Eroare la obținerea articolelor.');
    } finally {
      this.setLoading(false);
    }
  }

  resetArticles() {
    this.setArticles([]);
    this.setError(null);
  }

  // Metode pentru modificarea observabilelor
  setLoading(value) {
    this.isLoading = value;
  }

  setError(value) {
    this.error = value;
  }

  setArticles(value) {
    this.articles = value;
  }
}

const articleStore = new ArticleStore();
export default articleStore;
