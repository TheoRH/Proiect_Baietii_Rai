import db from '../config/dbConfig.js';
import Sequelize from 'sequelize';


const ConferenceAuthors = db.define('ConferenceAuthors', {
   
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
  