// dependencies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require("mongoose");
// import the Fruit model
const Fruit = require("./models/fruit.js");
const methodOverride = require("method-override");
const morgan = require("morgan");

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
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new


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

app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", { fruit: foundFruit });
});

// delte an object route
app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
});

//edit route used to send a page to the client with an edit form
app.get("/fruits/:fruitId/edit", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/edit.ejs", { fruit: foundFruit });
});

// update route - used to capture edit form submissions
// from the client and send updates to MongoDB
// server.js
app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }

    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
