import Article from '../entities/Articole.js';

export async function createArticle(data) {
  try {
    return await Article.create(data);
  } catch (error) {
    console.error('Eroare la crearea articolului:', error);
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
