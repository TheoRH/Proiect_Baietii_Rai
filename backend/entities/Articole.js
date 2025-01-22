import db from '../config/dbConfig.js';
import Sequelize from 'sequelize';
import User from './User.js';


const Article = db.define("Article", {
  ArticleId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  authorName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
  submittedDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  ConferenceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Conference',
      key: 'ConferenceId',
    },
  },
  feedback: { 
    type: Sequelize.TEXT, 
    allowNull: true, 
    defaultValue: null 
  },
});


export default Article;
