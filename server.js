const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
const path = require("path");

const HTTP_PORT = process.env.PORT || 8080;

// Initialize the Lego data
legoData.initialize();

app.use(express.static("public"));

app.use((req,res,next)=>{
  app.locals.currentRoute = req.path;
  next();
});

// init ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home")
});

app.get("/lego/sets", async (req, res) => {
  const sets = await legoData.getAllSets();
  res.json(sets);
});

app.get("/about", (req, res) => {
  res.render('about')
});

app.listen(HTTP_PORT, () => {
  console.log(`server listening on: ${HTTP_PORT}`);
});
