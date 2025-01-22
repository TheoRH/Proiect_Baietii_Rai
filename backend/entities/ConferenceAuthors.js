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

    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
   
    },
  });
  
  
  export default ConferenceAuthors;
  