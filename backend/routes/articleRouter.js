import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { createArticle, getArticles, getArticleById, deleteArticle, updateArticleStatus } from "../dataAccess/articleDA.js";

const articleRouter = express.Router();
articleRouter.use(authenticateToken); // Protejeaza toate rutele

// Rute pentru articole
articleRouter.route('/article')
  .post(async (req, res) => {
    try {
      const article = await createArticle(req.body);
      res.status(201).json(article);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare la crearea articolului.' });
    }
  })
  .get(async (req, res) => {
    try {
      const articles = await getArticles();
      res.status(200).json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare la obținerea articolelor.' });
    }
  });

articleRouter.route('/article/:id')
  .get(async (req, res) => {
    try {
      const article = await getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: 'Articolul nu a fost găsit.' });
      }
      res.status(200).json(article);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare.' });
    }
  })
  .delete(async (req, res) => {
    try {
      await deleteArticle(req.params.id);
      res.status(200).json({ message: 'Articol șters cu succes.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare la ștergerea articolului.' });
    }
  });

articleRouter.route('/article/:id/status').patch(async (req, res) => {
  try {
    await updateArticleStatus(req.params.id, req.body.status);
    res.status(200).json({ message: 'Statusul articolului a fost actualizat.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'A apărut o eroare la actualizarea statusului.' });
  }
});

export default articleRouter;
