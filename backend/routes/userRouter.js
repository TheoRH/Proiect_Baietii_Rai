import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUsers, getUserById, getUserByUsername } from "../dataAccess/userDA.js";
import authenticateToken from '../middleware/authenticateToken.js'

const userRouter = express.Router();

// Autentificare utilizator
userRouter.post('/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ error: 'Utilizatorul nu există!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Parola incorectă!' });
    }

    const token = jwt.sign(
      { id: user.UserId, username: user.username, role: user.role }, // Adăugăm username în token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.UserId, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error('Eroare la autentificare:', error);
    res.status(500).json({ message: 'A apărut o eroare la autentificare.' });
  }
});

userRouter.get('/reviewers', authenticateToken, async (req, res) => {
  try {
    const reviewers = await getUsers(); 
    const reviewersOnly = reviewers.filter(user => user.role === 'reviewer'); 
    res.status(200).json(reviewersOnly);
  } catch (error) {
    console.error('Eroare la obținerea reviewerilor:', error);
    res.status(500).json({ message: 'A apărut o eroare la obținerea reviewerilor.' });
  }
});


// Creare utilizator nou
userRouter.post('/user', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ message: 'Utilizatorul există deja.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'Utilizator creat cu succes.', user });
  } catch (error) {
    console.error('Eroare la crearea utilizatorului:', error);
    res.status(500).json({ message: 'A apărut o eroare la crearea utilizatorului.' });
  }
});

// Obține toți utilizatorii
userRouter.get('/user', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Eroare la obținerea utilizatorilor:', error);
    res.status(500).json({ message: 'A apărut o eroare la obținerea utilizatorilor.' });
  }
});

// Obține utilizatorul după ID
userRouter.get('/user/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Eroare la obținerea utilizatorului:', error);
    res.status(500).json({ message: 'A apărut o eroare.' });
  }
});

export default userRouter;
