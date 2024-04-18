/********************************************************************************
 *  WEB322 – Assignment 05
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Denyl Marc Bensan   Student ID: 171309222 Date: 04/07/2024
 *
 *  Published URL: https://powerful-button-hare.cyclic.app/
 *
 ********************************************************************************/

require("dotenv").config();
const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
const path = require("path");
const layout = require("express-ejs-layouts");
const Sequelize = require("sequelize");
const mongoose = require('mongoose');


// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, "/public")));

const HTTP_PORT = process.env.PORT || 3000;

// init ejs
app.set("view engine", "ejs");

// Initialize the Lego data
legoData.initialize();

app.use(layout);

// home page
app.get("/", (req, res) => {
  res.render("home");
});

// about page
app.get("/about", (req, res) => {
  res.render("about");
});

// route to themes or all lego data
app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme;
    let legoSets = theme
      ? await legoData.getSetsByTheme(theme)
      : await legoData.getAllSets();
      console.log(legoSets);
    res.render("sets", { sets: legoSets });
  } catch (error) {
    res
      .status(404)
      .render("404", { message: "Unable to find requested sets." });
  }
});

// query lego by id
app.get("/lego/sets/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const set = await legoData.getSetByNum(id);
    res.render("set", { set: set });
  } catch (error) {
    res.status(404).render("404", { message: "Unable to find requested set." });
  }
});

// DB CRUD methods
app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes: themes });
  } catch (err) {
    res.status(404).render("404", { message: "Unable to add set." });
  }
});

// creating a set
app.post("/lego/addSet", async (req, res) => {
  try {
    // validator to check set_num uniqueness
    const allSets = await legoData.getAllSets();
    const allSetIDs = allSets.map((set) => set.set_num);

    // If the set_num entered is already in the database
    if (allSetIDs.includes(req.body.set_num)) {
      throw new Error("ID already exists in the system.");
    }

    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

// updating a set
app.get("/lego/editSet/:setNum", async (req, res) => {
  try {
    const num = req.params.setNum;
    const set = await legoData.getSetByNum(num);
    const themes = await legoData.getAllThemes();
    res.render("editSet", { themes: themes, set: set });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

app.post("/lego/editSet", async (req, res) => {
  try {
    await legoData.editSet(req.body.set_num, req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

// delete set
app.get("/lego/deleteSet/:setNum", async (req, res) => {
  try {
    const num = req.params.setNum;
    await legoData.deleteSet(num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

// ERROR pages (404)
app.use((req, res) => {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for",
  });
});

app.listen(HTTP_PORT, () => {
  console.log(`this local server listening on the port: ${HTTP_PORT}`);
});
