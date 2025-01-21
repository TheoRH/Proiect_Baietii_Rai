import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import db from './config/dbConfig.js';
import DB_Init from './entities/dbInit.js';
import articleRouter from './routes/articleRouter.js';
import conferenceRouter from './routes/conferenceRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// conectare bd si init
db
  .authenticate()
  .then(() => {
    console.log('Conectare reușită la baza de date!');
    return DB_Init(); // init baza de date
  })
  .catch((error) => console.error('Eroare la conectarea la baza de date:', error));

// Rute API
app.use('/api', userRouter); // Rute pentru utilizatori
app.use('/api', articleRouter); // Rute pentru articole
app.use('/api', conferenceRouter); // Rute pentru conferinte

// Pornire server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});




