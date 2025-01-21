import { makeAutoObservable } from 'mobx';

class AuthStore {
  token = null;
  user = null;

  constructor() {
    makeAutoObservable(this);
    // Initializează din localStorage dacă există
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  login(data) {
    if (!data || !data.token) {
      console.error('Răspuns invalid de la backend:', data);
      return;
    }
    this.token = data.token; // Salvează token-ul în instanța curentă
    this.user = data.user; // Salvează informațiile despre utilizator
    localStorage.setItem('token', data.token); // Salvează token-ul în localStorage
    localStorage.setItem('user', JSON.stringify(data.user)); // Salvează utilizatorul în localStorage
  }
  

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  getUser() {
    return this.user || JSON.parse(localStorage.getItem('user'));
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

const authStore = new AuthStore();
export default authStore;
