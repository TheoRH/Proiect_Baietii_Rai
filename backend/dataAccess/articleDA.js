import Article from '../entities/Articole.js';
import User from '../entities/User.js';
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
    return await Article.findAll({
      include: [
        {
          model: User,
          as: 'Reviewers',
          where: { UserId: reviewerId },
        },
      ],
    });
  } catch (error) {
    console.error('Eroare la obținerea articolelor reviewerului:', error);
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
