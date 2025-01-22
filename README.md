# Proiect Management Articole Conferințe

Acest proiect este o aplicație pentru gestionarea articolelor trimise în cadrul conferințelor științifice. Aplicația permite utilizatorilor autentificați să creeze, revizuiască și gestioneze articolele, cu funcționalități specifice pentru autori și recenzori.

## Caracteristici principale

### Funcționalități pentru Autori
- Crearea articolelor noi.
- Vizualizarea articolelor proprii.
- Trimiterea unei versiuni noi a unui articol după primirea feedback-ului de la recenzori.

### Funcționalități pentru Recenzori
- Vizualizarea articolelor asociate conferințelor la care sunt alocați.
- Adăugarea de feedback pentru articole.
- Acceptarea sau respingerea articolelor.

### Alte funcționalități
- Asocierea articolelor cu conferințe specifice.
- Filtrarea articolelor pe baza statusului („pending”, „accepted”, „rejected”).
- Gestionarea relațiilor dintre utilizatori, articole și conferințe folosind Sequelize ORM.

---

## Tehnologii utilizate
- **Backend:** Node.js, Sequelize ORM
- **Frontend:** React.js
- **Baza de date:** MySQL/MariaDB
- **Autentificare:** Gestionat printr-un sistem de autentificare bazat pe roluri (autori și recenzori).

---

## Structura proiectului

### Backend
- `entities/Articole.js`: Model pentru articole.
- `entities/ConferenceReviewers.js`: Model pentru recenzori și conferințe.
- `entities/User.js`: Model pentru utilizatori.
- `entities/Conferinte.js`: Model pentru conferințe.

### Frontend
- **Componente principale:**
  - `ArticolCard`: Afișează detaliile unui articol, incluzând posibilitatea de a trimite feedback sau o versiune nouă.
- **Funcții:**
  - Gestionarea stării locale pentru afișarea articolelor.
  - Integrarea cu backend-ul prin API-uri pentru operațiuni CRUD.

---

## Instalare

### 1. Clonează repository-ul
```bash
git clone https://github.com/utilizator/repository.git
```

### 2. Instalează dependențele
#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configurare baza de date
- Creează o bază de date nouă (“articles_management”).
- Configurare conexiune în fișierul `.env` din directorul `backend`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=parola
DB_NAME=articles_management
```

### 4. Pornire aplicație
#### Backend
```bash
cd backend
npx nodemon server.js
```

#### Frontend
```bash
cd frontend
npm start
```

---

## Flux de utilizare
1. **Autentificare:** Utilizatorii se conectează în funcție de rol („author” sau „reviewer”).
2. **Gestionarea articolelor:**
   - Autorii pot crea articole noi sau trimite versiuni actualizate.
   - Recenzorii pot vizualiza articolele asociate conferințelor lor, adăuga feedback și modifica statusul articolelor.
3. **Afișarea datelor:** Datele sunt filtrate în funcție de utilizator și permisiuni.


