import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { createConference, getConferences, getConferenceById, deleteConference, addReviewerToConference, removeReviewerFromConference,addAuthorToConference,checkAuthorRegistration,proposeArticle } from "../dataAccess/conferenceDA.js";

const conferenceRouter = express.Router();
conferenceRouter.use(authenticateToken); // Protejeaza toate rutele


//Rute pentru articole
conferenceRouter.route('/conference/:id/articles')
.post(async (req, res) => {
  try {
    const { id: conferenceId } = req.params; // ID-ul conferinței din URL
    const { title, content, authorName } = req.body; // Datele din corpul cererii
    const { id: userId } = req.user; // ID-ul utilizatorului logat

    if (!title || !content || !authorName) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
    }

    const isRegistered = await checkAuthorRegistration(conferenceId, userId);
    if (!isRegistered) {
      return res.status(403).json({ message: 'Nu sunteți înregistrat la această conferință.' });
    }

    const article = await proposeArticle({
      title,
      content,
      conferenceId: conferenceId, // Conferința curentă
      userId, // Autorul
      authorName,
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Eroare la propunerea articolului:', error);
    res.status(500).json({ message: 'Nu s-a putut crea articolul.' });
  }
});


//Rute pentru autori
conferenceRouter.route('/conference/:id/authors')
.post(async (req, res) => {
  try {
    const { id: conferenceId } = req.params;
    const { id: userId } = req.user;

    // Verificare existența conferinței
    const conference = await getConferenceById(conferenceId);
    if (!conference) {
      return res.status(404).json({ message: 'Conferința nu a fost găsită.' });
    }

    // Înregistrarea autorului
    await addAuthorToConference(conferenceId, userId);
    res.status(200).json({ message: 'Te-ai alăturat cu succes conferinței!' });
  } catch (error) {
    console.error('Eroare la înregistrarea autorului:', error);
    res.status(500).json({ message: 'A apărut o eroare la înregistrarea autorului.' });
  }
});

conferenceRouter.get('/conference/:id/authors/participation', async (req, res) => {
  try {
    const { id: conferenceId } = req.params;
    const { id: userId } = req.user;

    const isParticipating = await checkAuthorRegistration(conferenceId, userId);

    res.status(200).json({ isParticipating });
  } catch (error) {
    console.error('Eroare la verificarea participării:', error);
    res.status(500).json({ message: 'A apărut o eroare la verificarea participării.' });
  }
});

// Rute pentru conferinte
conferenceRouter.route('/conference/:id/reviewers')
.post( async (req, res) => {
  try {
    const { id: conferenceId } = req.params;
    const { reviewerId } = req.body;
    const { id: userId } = req.user; // ID-ul utilizatorului din token

    if (!reviewerId) {
      return res.status(400).json({ message: 'ID-ul reviewerului este necesar.' });
    }

    // Verifică dacă utilizatorul logat este organizatorul conferinței
    const conference = await getConferenceById(conferenceId);
    if (!conference) {
      return res.status(404).json({ message: 'Conferința nu a fost găsită.' });
    }

    if (conference.OrganizerId !== userId) {
      return res.status(403).json({ message: 'Nu aveți permisiunea de a aloca revieweri pentru această conferință.' });
    }

    // Alocare reviewer
    const result = await addReviewerToConference(conferenceId, reviewerId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'A apărut o eroare la alocarea reviewerului.' });
  }
})
.get(async(req,res)=>{
  try{
    const { id: conferenceId } = req.params;
    const conference = await getConferenceById(conferenceId);
    if(!conference){
      return res.status(404).json({message: 'Conferința nu a fost găsită.'});
    }
    res.status(200).json(conference.Reviewers);
  }catch(error){
    console.error(error);
    res.status(500).json({message: 'A apărut o eroare la obținerea reviewerilor.'});
  }
})
.delete(async (req, res) => {
  try {
    const { id: conferenceId } = req.params;
    const { reviewerId } = req.body; // Obține ID-ul reviewerului din corpul cererii
    const { id: userId } = req.user; // ID-ul utilizatorului din token

    if (!reviewerId) {
      return res.status(400).json({ message: 'ID-ul reviewerului este necesar.' });
    }

    // Verifică dacă utilizatorul logat este organizatorul conferinței
    const conference = await getConferenceById(conferenceId);
    if (!conference) {
      return res.status(404).json({ message: 'Conferința nu a fost găsită.' });
    }

    if (conference.OrganizerId !== userId) {
      return res.status(403).json({ message: 'Nu aveți permisiunea de a șterge revieweri pentru această conferință.' });
    }

    // Elimină reviewerul din conferință
    const result = await removeReviewerFromConference(conferenceId, reviewerId);
    if (!result) {
      return res.status(404).json({ message: 'Reviewerul nu a fost găsit sau nu este alocat acestei conferințe.' });
    }

    res.status(200).json({ message: 'Reviewer eliminat cu succes.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'A apărut o eroare la ștergerea reviewerului.' });
  }
});


conferenceRouter.route('/conference')
  .post(async (req, res) => {
    try {
      // Verifică rolul utilizatorului
      if (req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Doar organizatorii pot adăuga conferințe.' });
      }

      const { id: OrganizerId, username: organizerName } = req.user; // ID-ul și numele organizatorului din token
      const newConference = await createConference({ ...req.body, OrganizerId, organizerName });
      res.status(201).json(newConference); // Returnează întreaga conferință creată
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare la crearea conferinței.' });
    }
  })
  .get(async (req, res) => {
    try {
      const conferences = await getConferences();
      res.status(200).json(conferences);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare la obținerea conferințelor.' });
    }
  });


conferenceRouter.route('/conference/:id')
  .get(async (req, res) => {
    try {
      const conference = await getConferenceById(req.params.id);
      if (!conference) {
        return res.status(404).json({ message: 'Conferința nu a fost găsită.' });
      }
      res.status(200).json(conference);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare.' });
    }
  })
  .delete(async (req, res) => {
    try {
      const { id: userId, role } = req.user;

      // Verifică rolul utilizatorului
      if (role !== 'organizer') {
        return res.status(403).json({ message: 'Doar organizatorii pot șterge conferințe.' });
      }

      // Verifică dacă organizatorul curent este cel care a creat conferința
      const conference = await getConferenceById(req.params.id);
      if (!conference) {
        return res.status(404).json({ message: 'Conferința nu a fost găsită.' });
      }

      if (conference.OrganizerId !== userId) {
        return res.status(403).json({ message: 'Nu poți șterge o conferință creată de alt organizator.' });
      }

      await deleteConference(req.params.id);
      res.status(200).json({ message: 'Conferință ștearsă cu succes.' });
    } catch (error) {
      console.error('Eroare la ștergerea conferinței:', error);
      res.status(500).json({ message: 'A apărut o eroare la ștergerea conferinței.' });
    }
  });

export default conferenceRouter;
