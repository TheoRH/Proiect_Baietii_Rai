import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { createConference, getConferences, getConferenceById, deleteConference } from "../dataAccess/conferenceDA.js";

const conferenceRouter = express.Router();
conferenceRouter.use(authenticateToken); // Protejeaza toate rutele

// Rute pentru conferinte
conferenceRouter.route('/conference')
  .post(async (req, res) => {
    try {
      const { id: OrganizerId } = req.user; // ID-ul utilizatorului din token
      const newConference = await createConference({ ...req.body, OrganizerId });
      res.status(201).json({ message: 'Conferință creată cu succes!', conferenceId: newConference.ConferenceId });
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
      await deleteConference(req.params.id);
      res.status(200).json({ message: 'Conferință ștearsă cu succes.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'A apărut o eroare la ștergerea conferinței.' });
    }
  });

export default conferenceRouter;
