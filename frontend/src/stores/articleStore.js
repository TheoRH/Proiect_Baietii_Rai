import { makeAutoObservable } from 'mobx';
import axiosInstance from '../axiosConfig';
import authStore from './AuthStore';

class ArticleStore {
  articles = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchUserArticles() {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate încărca lista de articole.');
      return;
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const response = await axiosInstance.get('/article/mine', {
        headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
      this.setArticles(response.data);
    } catch (error) {
      console.error('Eroare la obținerea articolelor utilizatorului:', error.response?.data || error.message);
      this.setError(error.response?.data?.message || 'Eroare la obținerea articolelor.');
    } finally {
      this.setLoading(false);
    }
  }

  async sendFeedback(articleId, feedback) {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate trimite feedback-ul.');
      return;
    }

    try {
      await axiosInstance.post(
        `/article/${articleId}/feedback`,
        { feedback },
        { headers: { Authorization: `Bearer ${authStore.getToken()}` } }
      );
    } catch (error) {
      console.error('Eroare la trimiterea feedback-ului:', error.response?.data || error.message);
      throw error;
    }
  }

  async submitNewVersion(articleId, content) {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate trimite o nouă versiune.');
      return;
    }

    try {
      await axiosInstance.patch(
        `/article/${articleId}/update`,
        { content },
        { headers: { Authorization: `Bearer ${authStore.getToken()}` } }
      );
    } catch (error) {
      console.error('Eroare la trimiterea noii versiuni:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateArticleStatus(articleId, status) {
    if (!authStore.getToken()) {
      console.warn('Token lipsă, nu se poate actualiza statusul.');
      return;
    }

    try {
      await axiosInstance.patch(
        `/article/${articleId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${authStore.getToken()}` },
      });
    } catch (error) {
      console.error('Eroare la actualizarea statusului articolului:', error.response?.data || error.message);
      throw error;
    }
  }

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
