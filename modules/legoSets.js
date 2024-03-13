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
const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
  return new Promise((resolve) => {
    setData.forEach((set) => {
      // Find the theme according to the set
      const theme = themeData.find((theme) => set.theme_id === theme.id);

      if (theme) {
        set.theme = theme.name;
        sets.push(set);
      }
    });
    // Resolve the promise after initialization
    resolve();
  });
}

function getAllSets() {
  return new Promise((resolve) => {
    if (sets.length > 0) resolve(sets);
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    const set = sets.find((set) => set.set_num === setNum);

    // If a set is found, resolve with the set, and reject with an error message if not found
    set ? resolve(set) : reject("Unable to find requested set.");
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    const setTheme = sets.filter((set) =>
      set.theme.toUpperCase().includes(theme.toUpperCase())
    );

    // If sets with the given theme are found, resolve with the setTheme array, reject with an error message if not
    setTheme.length > 0
      ? resolve(setTheme)
      : reject("Unable to find requested sets.");
  });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

//initialize();
//console.log(getSetsByTheme("The Muppets"));
