import Conference from '../entities/Conferinte.js';

export async function createConference(data) {
  try {
    return await Conference.create(data);
  } catch (error) {
    console.error('Eroare la crearea conferinței:', error);
    throw error;
  }
}

export async function getConferenceById(id) {
  try {
    const conference = await Conference.findByPk(id);
    if (!conference) {
      throw new Error('Conferința nu a fost găsită.');
    }
    return conference;
  } catch (error) {
    console.error('Eroare la obținerea conferinței:', error);
    throw error;
  }
}

export async function getConferences() {
  try {
    return await Conference.findAll();
  } catch (error) {
    console.error('Eroare la obținerea conferințelor:', error);
    throw error;
  }
}

export async function deleteConference(id) {
  try {
    const result = await Conference.destroy({ where: { ConferenceId: id } });
    if (result === 0) {
      throw new Error('Conferința nu a fost găsită pentru ștergere.');
    }
    return result;
  } catch (error) {
    console.error('Eroare la ștergerea conferinței:', error);
    throw error;
  }
}
