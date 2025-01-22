import Article from '../entities/Articole.js';
import ConferenceReviewers from '../entities/ConferenceReviewers.js';
import User from '../entities/User.js';


export async function getArticlesForUser(userId, role) {
  try {
    const whereCondition = {};

    // Condiții pentru rolul utilizatorului
    if (role === 'reviewer') {
      whereCondition.status = 'pending'; // Reviewerii văd doar articolele în așteptare
    } else if (role === 'author') {
      whereCondition.UserId = userId; // Autorii văd doar articolele proprii
    }

    const articles = await Article.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ['username'], // Dacă vrei să incluzi numele utilizatorului
        },
      ],
    });

    return articles;
  } catch (error) {
    console.error('Eroare la obținerea articolelor pentru utilizator:', error);
    throw error;
  }
}

export async function createArticle(data) {
  try {
    return await Article.create(data);
  } catch (error) {
    console.error('Eroare la crearea articolului:', error);
    throw error;
  }
}
export async function getArticlesByAuthor(authorId) {
  try {
    return await Article.findAll({ where: { UserId: authorId } });
  } catch (error) {
    console.error('Eroare la obținerea articolelor autorului:', error);
    throw error;
  }
}

export async function getArticlesByReviewer(reviewerId) {
  try {
    // Obține ConferenceId-urile asociate utilizatorului
    const conferenceIds = await ConferenceReviewers.findAll({
      where: { UserId: reviewerId }, // Condiția pentru UserId
      attributes: ['ConferenceId'], // Selectăm doar ConferenceId
      raw: true, // Returnăm doar datele brute
    });

    // Verifică dacă există conferințe asociate cu utilizatorul
    if (!conferenceIds || conferenceIds.length === 0) {
      
      return []; // Returnăm un array gol dacă nu există conferințe
    }

    // Extragem doar ConferenceId-urile
    const conferenceIdArray = conferenceIds.map(record => record.ConferenceId);

   

    // Căutăm articolele pe baza ConferenceId-urilor
    return await Article.findAll({
      where: { ConferenceId: conferenceIdArray }, // Filtrare pe baza listei de ConferenceId-uri
    });
  } catch (error) {
    console.error('Eroare la obținerea articolelor pentru reviewer:', error);
    throw error;
  }
}


export async function sendFeedback(articleId, reviewerId, feedback) {
  try {
    const article = await Article.findByPk(articleId);
    if (!article) {
      throw new Error('Articolul nu a fost găsit.');
    }

    article.feedback = feedback;
    article.status = 'pending';
    await article.save();
  } catch (error) {
    console.error('Eroare la trimiterea feedback-ului:', error);
    throw error;
  }
}

export async function updateArticleVersion(articleId, authorId, content) {
  try {
    const article = await Article.findOne({ where: { ArticleId: articleId, UserId: authorId } });
    if (!article) {
      throw new Error('Articolul nu a fost găsit sau nu aparține utilizatorului.');
    }

    article.content = content;
    article.status = 'pending';
    await article.save();
  } catch (error) {
    console.error('Eroare la actualizarea articolului:', error);
    throw error;
  }
}

export async function getArticleById(id) {
  try {
    const article = await Article.findByPk(id);
    if (!article) {
      throw new Error('Articolul nu a fost găsit.');
    }
    return article;
  } catch (error) {
    console.error('Eroare la obținerea articolului:', error);
    throw error;
  }
}

export async function getArticles() {
  try {
    return await Article.findAll();
  } catch (error) {
    console.error('Eroare la obținerea articolelor:', error);
    throw error;
  }
}

export async function deleteArticle(id) {
  try {
    const result = await Article.destroy({ where: { ArticleId: id } });
    if (result === 0) {
      throw new Error('Articolul nu a fost găsit pentru ștergere.');
    }
    return result;
  } catch (error) {
    console.error('Eroare la ștergerea articolului:', error);
    throw error;
  }
}

export async function updateArticleStatus(id, status) {
  try {
    const article = await Article.findByPk(id);
    if (!article) {
      throw new Error('Articolul nu a fost găsit.');
    }
    article.status = status;
    await article.save();
    return article;
  } catch (error) {
    console.error('Eroare la actualizarea statusului articolului:', error);
    throw error;
  }
}
