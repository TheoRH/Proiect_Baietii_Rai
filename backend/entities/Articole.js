import db from '../config/dbConfig.js';
import Sequelize from 'sequelize';

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
  conferenceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Conference',
      key: 'ConferenceId',
    },
  },
});

export default Article;
