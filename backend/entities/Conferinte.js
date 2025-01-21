import db from '../config/dbConfig.js';
import Sequelize from 'sequelize';

const Conference = db.define("Conference", {
  ConferenceId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  organizerName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  maxParticipants: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  OrganizerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

export default Conference;
