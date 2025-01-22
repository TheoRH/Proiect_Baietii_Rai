import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { createArticle, getArticles, getArticleById, deleteArticle, updateArticleStatus, getArticlesByReviewer, getArticlesByAuthor, getArticlesForUser,sendFeedback,updateArticleVersion, getConferenceNameByArticleId, getArticlesByConference   } from "../dataAccess/articleDA.js";



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

  articleRouter.route('/article/mine').get(async (req, res) => {
    try {
      const userId = req.user.id; // ID-ul utilizatorului din token
      const role = req.user.role; // Rolul utilizatorului din token
  
      const articles = await getArticlesForUser(userId, role);
      res.status(200).json(articles);
    } catch (error) {
      console.error('Eroare la obținerea articolelor utilizatorului:', error);
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

articleRouter.route('/article/:id/feedback')
  .post(async (req, res) => {
    try {
      const { feedback } = req.body;
      const { id } = req.params;
      const { id: reviewerId } = req.user;

      console.log('Feedback primit:', feedback, 'Pentru articol:', id, 'De la reviewer:', reviewerId);

      await sendFeedback(id, reviewerId, feedback);
      res.status(200).json({ message: 'Feedback trimis cu succes.' });
    } catch (error) {
      console.error('Eroare la trimiterea feedback-ului:', error);
      res.status(500).json({ message: 'A apărut o eroare la trimiterea feedback-ului.' });
    }
  });


articleRouter.route('/article/:id/update')
  .patch(async (req, res) => {
    try {
      const { content } = req.body;
      const { id } = req.params;
      const { id: authorId } = req.user;

      await updateArticleVersion(id, authorId, content);
      res.status(200).json({ message: 'Versiunea articolului a fost actualizată.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare la actualizarea articolului.' });
    }
  });




  articleRouter.route('/conference/:id/articles').get(async (req, res) => {
    try {
      const { id } = req.params; // Obține ConferenceId din URL
      const articles = await getArticlesByConference(id);
      res.status(200).json(articles);
    } catch (error) {
      console.error('Eroare la obținerea articolelor pentru conferință:', error);
      res.status(500).json({ message: 'A apărut o eroare la obținerea articolelor pentru conferință.' });
    }
  });
  

  articleRouter.route('/article/:id/conference-name').get(async (req, res) => {
    try {
      const conferenceName = await getConferenceNameByArticleId(req.params.id);
      res.status(200).send(conferenceName); // Trimite doar string-ul
    } catch (error) {
      console.error('Eroare în backend:', error);
      res.status(500).send('Eroare la obținerea numelui conferinței.');
    }
  });
  


export default articleRouter;
