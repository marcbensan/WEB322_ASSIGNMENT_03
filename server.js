/********************************************************************************

* WEB322 – Assignment 03

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: Denyl Marc Bensan Student ID: 171309222 Date: 03/15/2024

*

* Published URL: https://powerful-button-hare.cyclic.app/

*

********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
const path = require("path");
const layout = require("express-ejs-layouts");

app.use(express.static(path.join(__dirname, "/public")));
app.use(layout);
app.use((req, res, next) => {
  app.locals.currentRoute = req.path;
  next();
});

const HTTP_PORT = process.env.PORT || 8080;

// init ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Initialize the Lego data
legoData.initialize();

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
    let sets = theme
      ? await legoData.getSetsByTheme(theme)
      : await legoData.getAllSets();
    res.json(sets);
  } catch (error) {
    res.status(404).render("404");
  }
});

// query lego by id
app.get("/lego/sets/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const set = await legoData.getSetByNum(id);
    res.json(set);
  } catch (error) {
    res.status(404).render("404");
  }
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(HTTP_PORT, () => {
  console.log(`this local server listening on the port: ${HTTP_PORT}`);
});
