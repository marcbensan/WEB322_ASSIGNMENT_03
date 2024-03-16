const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "/public")));

const HTTP_PORT = process.env.PORT || 8080;

// Initialize the Lego data
legoData.initialize();

// init ejs
app.set("view engine", "ejs");

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
    if (!set) throw new Error("Lego set not found");
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
