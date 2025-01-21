import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { createConference, getConferences, getConferenceById, deleteConference, addReviewerToConference} from "../dataAccess/conferenceDA.js";

const conferenceRouter = express.Router();
conferenceRouter.use(authenticateToken); // Protejeaza toate rutele

// Rute pentru conferinte
conferenceRouter.post('/conference/:id/reviewers', async (req, res) => {
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
