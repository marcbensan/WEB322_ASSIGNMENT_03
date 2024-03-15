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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/lego/sets", async (req, res) => {
  const sets = await legoData.getAllSets();
  res.json(sets);
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(HTTP_PORT, () => {
  console.log(`this local server listening on the port: ${HTTP_PORT}`);
});
