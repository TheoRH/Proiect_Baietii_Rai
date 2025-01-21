import db from '../config/dbConfig.js';
import Sequelize from 'sequelize';

const ConferenceReviewers = db.define('ConferenceReviewers', {
  ConferenceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Conferences', // Numele tabelei conferințelor
      key: 'id',
    },
    primaryKey: true, // Parte a cheii primare compuse
  },
  UserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Numele tabelei utilizatorilor
      key: 'id',
    },
    primaryKey: true, // Parte a cheii primare compuse
  },
});

export default ConferenceReviewers;
