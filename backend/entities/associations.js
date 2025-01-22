import Conference from './Conferinte.js';
import User from './User.js';
import ConferenceAuthors from './ConferenceAuthors.js';
import Article from './Articole.js';

// Relația N-N între Conference și User prin ConferenceReviewers
Conference.belongsToMany(User, {
  through: 'ConferenceReviewers',
  as: 'Reviewers',
  foreignKey: 'ConferenceId',
});

User.belongsToMany(Conference, {
  through: 'ConferenceReviewers',
  as: 'Conferences',
  foreignKey: 'UserId',
});

// Relația N-N între Conference și User prin ConferenceAuthors
Conference.belongsToMany(User, {
  through: ConferenceAuthors,
  as: 'Authors',
  foreignKey: 'ConferenceId',
});

User.belongsToMany(Conference, {
  through: ConferenceAuthors,
  as: 'WrittenConferences',
  foreignKey: 'UserId',
});

// Relația N-N între Conference și Article prin tabela intermediară
Conference.belongsToMany(Article, {
  through: 'ConferenceArticles',
  as: 'Articles',
  foreignKey: 'ConferenceId',
});

Article.belongsToMany(Conference, {
  through: 'ConferenceArticles',
  as: 'Conferences',
  foreignKey: 'ArticleId',
});

// Exportă modelele
export { Conference, User, ConferenceAuthors, Article };
