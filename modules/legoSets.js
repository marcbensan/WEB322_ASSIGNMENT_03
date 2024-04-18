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

const themeData = require("../data/themeData");
const setData = require("../data/setData.json");
require("dotenv").config();
const Sequelize = require("sequelize");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

// sequelize init
// const sequelize = new Sequelize(
//   process.env.DB_DATABASE,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     port: 5432,
//     dialectOptions: {
//       ssl: { rejectUnauthorized: false },
//     },
//   }
// );

// const Theme = sequelize.define(
//   "Theme",
//   {
//     id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//     name: Sequelize.STRING,
//   },
//   {
//     createdAt: false,
//     updatedAt: false,
//   }
// );

// const Set = sequelize.define(
//   "Set",
//   {
//     set_num: { type: Sequelize.STRING, primaryKey: true },
//     name: Sequelize.STRING,
//     year: Sequelize.INTEGER,
//     num_parts: Sequelize.INTEGER,
//     theme_id: Sequelize.INTEGER,
//     img_url: Sequelize.STRING,
//   },
//   {
//     createdAt: false,
//     updatedAt: false,
//   }
// );

// Set.belongsTo(Theme, {
//   foreignKey: "theme_id",
// });

let themeSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: String,
  },
  { _id: false }
);

let Theme = mongoose.model("Themes", themeSchema);

let setSchema = new Schema({
  set_num: String,
  name: String,
  year: Number,
  theme_id: Number,
  num_parts: Number,
  img_url: String,
  theme: {
    id: Number,
    name: String,
  },
});

let Set = mongoose.model("Sets", setSchema);

// initialize mongoose
function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      mongoose.connect(process.env.DB_CONNECTION_STRING);
      console.log("Connected successfully.");
      resolve();
    } catch (err) {
      reject(err.message);
      process.exit(1);
    }
  });
}

// FUNCTION TO LOAD THE TABLE WITH DATA
// function initialize() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       mongoose.connect(process.env.DB_CONNECTION_STRING);
//       console.log("Connected to MongoDB successfully.");

//       const themesExist = await Theme.exists({});
//       const setsExist = await Set.exists({});

//       if (!themesExist) {
//         await Theme.insertMany(themeData);
//         console.log("Themes data inserted to table");
//       }

//       if (!setsExist) {
//         // Iterate through each set and populate the theme field
//         for (const set of setData) {
//           const theme = await Theme.findOne({ id: set.theme_id });
//           if (theme) {
//             set.theme = { id: theme.id, name: theme.name };
//           }
//         }
//         await Set.insertMany(setData);
//         console.log("Sets data inserted to table");
//       }

//       resolve();
//     } catch (err) {
//       console.error("Error during data insertion:", err);
//       reject(err.message);
//       process.exit(1); // Exit the process with a failure code
//     }
//   });
// }

// initialize();

function getAllSets() {
  return new Promise((resolve, reject) => {
    Set.find({})
      .exec()
      .then((sets) => {
        resolve(sets);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// added a new function that retrieves all themes
function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.find({})
      .exec()
      .then((themes) => {
        console.log(themes);
        resolve(themes);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findOne({
      set_num: setNum,
    })
      .exec()
      .then((sets) => {
        if (sets.length === 0) {
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
    Set.find({})
      .exec()
      .then((sets) => {
        const themedSets = sets.filter((set) => set.theme.name === theme);
        resolve(themedSets);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function addSet(setData) {
  return new Promise((resolve, reject) => {
    const { set_num, name, year, num_parts, theme_id, img_url } = setData;

    const newSet = new Set({
      set_num: set_num,
      name: name,
      year: year,
      theme_id: theme_id,
      num_parts: num_parts,
      img_url: img_url,
    });

    newSet
      .save()
      .then((createdSet) => {
        resolve(createdSet);
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

function editSet(set_num, setData) {
  return new Promise((resolve, reject) => {
    const { name, year, num_parts, theme_id, img_url } = setData;

    Set.updateOne(
      {
        set_num: set_num,
      },
      {
        $set: {
          name: name,
          year: year,
          theme_id: theme_id,
          num_parts: num_parts,
          img_url: img_url,
        },
      }
    )
      .exec()
      .then((set) => {
        resolve(set);
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

function deleteSet(set_num) {
  return new Promise((resolve, reject) => {
    Set.deleteOne({
      set_num: set_num,
    })
      .exec()
      .then((set) => {
        resolve(set);
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });
}

module.exports = {
  initialize,
  getAllSets,
  getAllThemes,
  getSetByNum,
  getSetsByTheme,
  addSet,
  editSet,
  deleteSet,
};
