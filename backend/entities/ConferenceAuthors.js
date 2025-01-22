import db from '../config/dbConfig.js';
import Sequelize from 'sequelize';


const ConferenceAuthors = db.define('ConferenceAuthors', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ConferenceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'conference', // Numele tabelului
        key: 'id',
      },
      onDelete: 'CASCADE', // Opțional, pentru gestionarea ștergerii
    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user', // Numele tabelului
        key: 'id',
      },
      onDelete: 'CASCADE', // Opțional
    },
  });
  
  export default ConferenceAuthors;
  