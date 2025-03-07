// dependencies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require("mongoose");
// import the Fruit model
const Fruit = require("./models/fruit.js");

// init the express application
const app = express();

// config code
dotenv.config();

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//mount middleware functions here
app.use(express.urlencoded({ extended: false }));


// GET / Home page path route
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// path to form to fill out
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs");
});

// form submission path
// POST /fruits
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect("/fruits");
});

// index route sends a page that list all fruits
// GET /fruits
app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find({});
    res.render("fruits/index.ejs", { fruits: allFruits });
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
