import { makeAutoObservable, action } from 'mobx';

class AuthStore {
  token = null;
  user = null;

  constructor() {
    makeAutoObservable(this, {
      login: action,
      logout: action,
    });
    // Initializează din localStorage dacă există
    this.loadFromStorage();
  }

  loadFromStorage() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      this.token = storedToken;
    }
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        console.error('Eroare la parsarea utilizatorului din localStorage:', error);
      }
    }
  }

  login(data) {
    if (!data || !data.token) {
      console.error('Răspuns invalid de la backend:', data);
      return;
    }
    this.token = data.token;
    this.user = data.user;

    // Salvează în localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  logout() {
    this.token = null;
    this.user = null;

    // Elimină din localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.token;
  }
}

const authStore = new AuthStore();
export default authStore;
