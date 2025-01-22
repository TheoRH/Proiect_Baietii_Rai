import Conference from '../entities/Conferinte.js';
import User from '../entities/User.js';
import ConferenceReviewers from '../entities/ConferenceReviewers.js';
import ConferenceAuthors from '../entities/ConferenceAuthors.js';
import Article from '../entities/Articole.js';

//functie de adaugat articole
export async function proposeArticle({ title, content, conferenceId, authorName }) {
  try {
    const article = await Article.create({
      title,
      content,
      authorName,
      status:'pending',
      submittedDate: new Date(),
      ConferenceId: conferenceId,
    
    });
    const conference = await Conference.findByPk(conferenceId);
    if (conference) {
      await conference.addArticle(article); // Adaugă articolul la conferință
    } else {
      throw new Error('Conferința specificată nu a fost găsită.');
    }

    return article;
  } catch (error) {
    console.error('Eroare la crearea articolului:', error);
    throw new Error('Nu s-a putut crea articolul.');
  }
}

//functie de a verifica daca autorul este inregistrat
export async function checkAuthorRegistration(conferenceId, userId) {
  try {
    const registration = await ConferenceAuthors.findOne({
      where: {
        ConferenceId: conferenceId,
        UserId: userId,
      },
    });
    return !!registration; // Returnează true dacă autorul este deja înregistrat
  } catch (error) {
    console.error('Eroare la verificarea înregistrării autorului:', error);
    throw new Error('Nu s-a putut verifica înregistrarea autorului.');
  }
}


//functie de a alatura autor
export async function addAuthorToConference(conferenceId, userId) {
  try {
    await ConferenceAuthors.create({
      ConferenceId: conferenceId,
      UserId: userId,
    });
    return { message: 'Autorul a fost înregistrat cu succes la conferință.' };
  } catch (error) {
    console.error('Eroare la adăugarea autorului în conferință:', error);
    throw error;
  }
}


export async function addReviewerToConference(conferenceId, reviewerId) {
  try {
    const conference = await Conference.findByPk(conferenceId);
    const reviewer = await User.findByPk(reviewerId);

    if (!conference || !reviewer) {
      throw new Error('Conferința sau utilizatorul nu a fost găsit.');
    }

    await conference.addReviewer(reviewer); // adauga reviewer
    return { message: 'Reviewer adăugat cu succes la conferință.' };
  } catch (error) {
    console.error('Eroare la alocarea reviewerului:', error);
    throw error;
  }
}

//functie de sterge reviewer din conferinta
export async function removeReviewerFromConference(conferenceId, reviewerId) {
  try {
    const result = await ConferenceReviewers.destroy({
      where: {
        ConferenceId: conferenceId,
        UserId: reviewerId,
      },
    });
    return result > 0; // Returnează true dacă ștergerea a avut loc
  } catch (error) {
    console.error('Eroare la ștergerea reviewerului din baza de date:', error);
    throw error;
  }
}


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
    const conference = await Conference.findByPk(id, {
      include: [
        {
          model: User,
          as: "Reviewers", // Afișează reviewerii alocați
          attributes: ["UserId", "username"], // Alege doar atributele necesare
        },
      ],
    });

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
