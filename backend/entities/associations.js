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


// Adăugare relație hasMany pentru utilizarea metodei addArticle
Conference.hasMany(Article, { foreignKey: 'ConferenceId' });
Article.belongsTo(Conference, { foreignKey: 'ConferenceId' });

// Exportă modelele
export { Conference, User, ConferenceAuthors, Article };
