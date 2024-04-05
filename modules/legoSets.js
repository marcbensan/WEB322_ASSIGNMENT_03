/********************************************************************************
 *  WEB322 – Assignment 02
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Denyl Marc Bensan Student ID: 171309222 Date: 02-15-2024
 *
 ********************************************************************************/
// const setData = require("../data/setData");
// const themeData = require("../data/themeData");
require("dotenv").config();
const Sequelize = require("sequelize");

// sequelize init
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

const Theme = sequelize.define(
  "Theme",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

const Set = sequelize.define(
  "Set",
  {
    set_num: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Set.belongsTo(Theme, {
  foreignKey: "theme_id",
});

// let sets = [];

// old initialize function
// setData.forEach((set) => {
//   // Find the theme according to the set
//   const theme = themeData.find((theme) => set.theme_id === theme.id);

//   if (theme) {
//     set.theme = theme.name;
//     sets.push(set);
//   }

function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      await sequelize.sync();
      console.log("Connected successfully.");

      resolve();
    } catch (err) {
      reject(err.message);
    }
  });
}

// FUNCTION TO LOAD THE TABLE WITH DATA
// function initialize() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await sequelize.sync();

//       const themesExists = await Theme.findAll();
//       const setsExists = await Set.findAll();

//       if (themesExists.length === 0) {
//         await Theme.bulkCreate(themeData);
//       }

//       if (setsExists.length === 0) {
//         await Set.bulkCreate(setData);
//       }

//       console.log("Data inserted to table");

//       resolve();
//     } catch (err) {
//       reject(err.message);
//     }
//   });
// }

// initialize();

function getAllSets() {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
    })
      .then((sets) => {
        resolve(sets);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
      where: { set_num: setNum },
    })
      .then((sets) => {
        if (!sets) {
          reject("Unable to find requested set");
        }
        resolve(sets);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
      where: {
        "$Theme.name$": {
          [Sequelize.Op.iLike]: `%${theme}%`,
        },
      },
    })
      .then((sets) => {
        if (!sets) {
          reject("Unable to find requested sets.");
        }

        resolve(sets);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

//initialize();
//console.log(getSetsByTheme("The Muppets"));
