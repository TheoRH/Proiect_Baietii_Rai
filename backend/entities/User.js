import db from '../config/dbConfig.js';
import Sequelize from 'sequelize';


const User = db.define("User", {
  UserId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.ENUM('author', 'reviewer', 'organizer'), 
    defaultValue: 'author',
  },
});

export default User;
