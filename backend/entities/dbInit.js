import mysql from 'mysql2/promise';
import env from 'dotenv';
import User from "./User.js";
import Conference from "./Conferinte.js";
import Article from "./Articole.js";
import db from '../config/dbConfig.js';
import { aliasUser, aliasConference, aliasArticle } from './dbConst.js';

env.config();

// creare bd
async function Create_DB() {
  try {
    const conn = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
    await conn.end();
    console.log('Baza de date a fost creată/verificată cu succes.');
  } catch (err) {
    console.warn('Eroare la crearea bazei de date:', err.stack);
  }
}

// relatii intre entitati
function FK_Config() {
  // Relații 1-n
  User.hasMany(Article, { as: aliasArticle, foreignKey: "UserId" });
  Article.belongsTo(User, { foreignKey: "UserId" });

  User.hasMany(Conference, { as: aliasConference, foreignKey: "OrganizerId" });
  Conference.belongsTo(User, { foreignKey: "OrganizerId" });

  // Relație 1-n între Conference și Article
  Conference.hasMany(Article, { foreignKey: "ConferenceId" });
  Article.belongsTo(Conference, { foreignKey: "ConferenceId" });
}


const DB_Init = async () => {
  try {
    await Create_DB(); // Creare bd
    FK_Config(); // Configurare relații

    // Relațiile trebuie definite înainte de sincronizare
    Conference.belongsToMany(User, { 
      through: "ConferenceReviewers", 
      as: "Reviewers", 
      foreignKey: "ConferenceId" 
    });

    User.belongsToMany(Conference, { 
      through: "ConferenceReviewers", 
      as: "ReviewerConferences", 
      foreignKey: "UserId" 
    });

    // Sincronizare bazei de date
    await db.sync({ alter: true }); // Sincronizează baza de date
    console.log("Tabelele au fost sincronizate cu succes!");
  } catch (err) {
    console.error("Eroare la sincronizarea bazei de date:", err);
  }
};


export default DB_Init;

