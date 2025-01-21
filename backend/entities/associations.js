import Conference from './Conferinte.js';
import User from './User.js';

// Relația N-N între Conference și User
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

// Exportă modelele
export { Conference, User };
